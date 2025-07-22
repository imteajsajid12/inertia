<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AnalyticsService
{
    public function calculateMRR()
    {
        $activeSubscriptions = DB::table('subscriptions')
            ->where('stripe_status', 'active')
            ->get();

        $mrr = 0;
        foreach ($activeSubscriptions as $subscription) {
            // Get the subscription price from Stripe
            $user = User::find($subscription->user_id);
            if ($user && $user->subscription('default')) {
                $stripeSubscription = $user->subscription('default')->asStripeSubscription();
                $monthlyAmount = $stripeSubscription->items->data[0]->price->unit_amount / 100;

                // Convert to monthly if yearly
                if ($stripeSubscription->items->data[0]->price->recurring->interval === 'year') {
                    $monthlyAmount = $monthlyAmount / 12;
                }

                $mrr += $monthlyAmount;
            }
        }

        return round($mrr, 2);
    }

    public function getTotalRevenue()
    {
        if (!Schema::hasTable('invoices')) {
            return 0;
        }

        return DB::table('invoices')
            ->where('status', 'paid')
            ->sum('total');
    }

    public function getRevenueChart($months = 12)
    {
        $data = [];
        $labels = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $labels[] = $date->format('M Y');

            if (Schema::hasTable('invoices')) {
                $revenue = DB::table('invoices')
                    ->where('status', 'paid')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->sum('total');
            } else {
                $revenue = 0;
            }

            $data[] = $revenue / 100; // Convert from cents to dollars
        }

        return [
            'labels' => $labels,
            'data'   => $data,
        ];
    }


    public function getSubscriptionGrowth($months = 12)
    {
        $data = [];
        $labels = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $labels[] = $date->format('M Y');

            $subscriptions = DB::table('subscriptions')
                ->where('stripe_status', 'active')
                ->whereYear('created_at', '<=', $date->year)
                ->whereMonth('created_at', '<=', $date->month)
                ->count();

            $data[] = $subscriptions;
        }

        return [
            'labels' => $labels,
            'data' => $data,
        ];
    }

    public function getChurnRate($period = 'monthly')
    {
        $startDate = $period === 'monthly' ? Carbon::now()->subMonth() : Carbon::now()->subYear();

        $activeAtStart = DB::table('subscriptions')
            ->where('stripe_status', 'active')
            ->where('created_at', '<=', $startDate)
            ->count();

        $churned = DB::table('subscriptions')
            ->where('stripe_status', 'canceled')
            ->where('ends_at', '>=', $startDate)
            ->where('ends_at', '<=', Carbon::now())
            ->count();

        return $activeAtStart > 0 ? round(($churned / $activeAtStart) * 100, 2) : 0;
    }

    public function getPlanDistribution()
    {
        $plans = Plan::withCount(['subscriptions' => function ($query) {
            $query->where('stripe_status', 'active');
        }])->get();

        return $plans->map(function ($plan) {
            return [
                'name' => $plan->name,
                'count' => $plan->subscriptions_count,
                'percentage' => $this->calculatePercentage($plan->subscriptions_count),
            ];
        });
    }

    private function calculatePercentage($count)
    {
        $total = DB::table('subscriptions')
            ->where('stripe_status', 'active')
            ->count();

        return $total > 0 ? round(($count / $total) * 100, 1) : 0;
    }
}
