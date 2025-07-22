<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Cashier\Subscription;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    public function index(Request $request)
    {
        $query = Subscription::with('user');

        if ($request->status && $request->status !== 'all') {
            $query->where('stripe_status', $request->status);
        }

        if ($request->search) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        }

        $subscriptions = $query->latest()
            ->get()
            ->map(function ($subscription) {
                // Get plan info from our plans table if available
                $plan = \App\Models\Plan::where('gateway_ids->stripe', $subscription->stripe_price)->first();

                return [
                    'id' => $subscription->id,
                    'user' => [
                        'id' => $subscription->user->id,
                        'name' => $subscription->user->name,
                        'email' => $subscription->user->email,
                    ],
                    'plan' => $plan ? [
                        'id' => $plan->id,
                        'name' => $plan->name,
                        'price' => $plan->price * 100, // Convert to cents for consistency
                        'billing_period' => $plan->billing_period,
                    ] : null,
                    'name' => $subscription->name,
                    'stripe_id' => $subscription->stripe_id,
                    'stripe_status' => $subscription->stripe_status,
                    'stripe_price' => $subscription->stripe_price,
                    'quantity' => $subscription->quantity,
                    'trial_ends_at' => $subscription->trial_ends_at?->toISOString(),
                    'ends_at' => $subscription->ends_at?->toISOString(),
                    'current_period_end' => $subscription->ends_at?->toISOString() ?? now()->addMonth()->toISOString(),
                    'created_at' => $subscription->created_at->toISOString(),
                ];
            });

        // Calculate stats
        $stats = [
            'total' => Subscription::count(),
            'active' => Subscription::where('stripe_status', 'active')->count(),
            'trialing' => Subscription::where('stripe_status', 'trialing')->count(),
            'canceled' => Subscription::where('stripe_status', 'canceled')->count(),
            'monthly_revenue' => $this->calculateMonthlyRevenue(),
        ];

        return Inertia::render('Admin/Subscriptions/Index', [
            'subscriptions' => $subscriptions,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Subscription $subscription)
    {
        $subscription->load('user');

        // Get plan info from our plans table if available
        $plan = \App\Models\Plan::where('gateway_ids->stripe', $subscription->stripe_price)->first();

        // Get subscription details from Stripe
        try {
            $stripeSubscription = $subscription->asStripeSubscription();
            $currentPeriodEnd = $stripeSubscription->current_period_end;
            $currentPeriodStart = $stripeSubscription->current_period_start;
        } catch (\Exception $e) {
            $currentPeriodEnd = $subscription->ends_at ? $subscription->ends_at->timestamp : now()->addMonth()->timestamp;
            $currentPeriodStart = now()->timestamp;
        }

        // Get recent invoices
        $invoices = [];
        try {
            $invoices = $subscription->user->invoices()->take(10)->map(function ($invoice) {
                return [
                    'id' => $invoice->id,
                    'created' => $invoice->date()->timestamp,
                    'amount_paid' => $invoice->total(),
                    'status' => $invoice->status,
                    'currency' => $invoice->currency,
                ];
            });
        } catch (\Exception $e) {
            // Handle case where invoices can't be retrieved
        }

        // Get payment methods
        $paymentMethods = [];
        try {
            $paymentMethods = $subscription->user->paymentMethods()->take(5)->map(function ($paymentMethod) {
                return [
                    'id' => $paymentMethod->id,
                    'brand' => $paymentMethod->card->brand,
                    'last4' => $paymentMethod->card->last4,
                    'exp_month' => $paymentMethod->card->exp_month,
                    'exp_year' => $paymentMethod->card->exp_year,
                ];
            });
        } catch (\Exception $e) {
            // Handle case where payment methods can't be retrieved
        }

        return Inertia::render('Admin/Subscriptions/Show', [
            'subscription' => [
                'id' => $subscription->id,
                'user' => [
                    'id' => $subscription->user->id,
                    'name' => $subscription->user->name,
                    'email' => $subscription->user->email,
                ],
                'plan' => $plan ? [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'price' => $plan->price * 100, // Convert to cents
                    'billing_period' => $plan->billing_period,
                ] : null,
                'name' => $subscription->name,
                'stripe_id' => $subscription->stripe_id,
                'stripe_status' => $subscription->stripe_status,
                'stripe_price' => $subscription->stripe_price,
                'quantity' => $subscription->quantity,
                'trial_ends_at' => $subscription->trial_ends_at?->toISOString(),
                'ends_at' => $subscription->ends_at?->toISOString(),
                'created_at' => $subscription->created_at->toISOString(),
                'updated_at' => $subscription->updated_at->toISOString(),
                'current_period_start' => date('c', $currentPeriodStart),
                'current_period_end' => date('c', $currentPeriodEnd),
            ],
            'invoices' => $invoices,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    public function cancel(Subscription $subscription)
    {
        $subscription->cancelNow();

        return back()->with('success', 'Subscription cancelled successfully.');
    }

    public function resume(Subscription $subscription)
    {
        $subscription->resume();

        return back()->with('success', 'Subscription resumed successfully.');
    }

    private function calculateMonthlyRevenue()
    {
        $activeSubscriptions = Subscription::where('stripe_status', 'active')->get();
        $totalRevenue = 0;

        foreach ($activeSubscriptions as $subscription) {
            $plan = \App\Models\Plan::where('gateway_ids->stripe', $subscription->stripe_price)->first();
            if ($plan) {
                $monthlyAmount = $plan->price * $subscription->quantity;
                if ($plan->billing_period === 'yearly') {
                    $monthlyAmount = $monthlyAmount / 12;
                }
                $totalRevenue += $monthlyAmount;
            }
        }

        return number_format($totalRevenue, 2);
    }

    public function analytics(Request $request)
    {
        $dateRange = $request->get('range', '30d');

        // Calculate analytics based on date range
        $analytics = [
            'total_revenue' => $this->calculateTotalRevenue($dateRange),
            'active_subscriptions' => Subscription::where('stripe_status', 'active')->count(),
            'mrr' => $this->calculateMonthlyRevenue(),
            'churn_rate' => $this->calculateChurnRate($dateRange),
            'lifetime_value' => '$1,250', // Placeholder
            'avg_subscription_length' => '8.5', // Placeholder
            'trial_conversion' => '68.2', // Placeholder
            'plan_performance' => $this->getPlanPerformance(),
        ];

        return Inertia::render('Admin/Subscriptions/Analytics', [
            'analytics' => $analytics,
            'dateRange' => $dateRange,
        ]);
    }

    public function export(Request $request)
    {
        $format = $request->get('format', 'csv');
        $subscriptions = Subscription::with('user')->get();

        if ($format === 'csv') {
            return $this->exportToCsv($subscriptions);
        }

        return back()->with('error', 'Export format not supported.');
    }

    private function calculateTotalRevenue($dateRange)
    {
        // This is a simplified calculation
        // In a real app, you'd calculate based on actual payments/invoices
        $multiplier = match ($dateRange) {
            '7d' => 0.25,
            '30d' => 1,
            '90d' => 3,
            '1y' => 12,
            default => 1,
        };

        $monthlyRevenue = (float) str_replace(',', '', $this->calculateMonthlyRevenue());

        return number_format($monthlyRevenue * $multiplier, 2);
    }

    private function calculateChurnRate($dateRange)
    {
        // Simplified churn rate calculation
        $totalSubscriptions = Subscription::count();
        $canceledSubscriptions = Subscription::where('stripe_status', 'canceled')->count();

        if ($totalSubscriptions === 0) {
            return '0.0';
        }

        $churnRate = ($canceledSubscriptions / $totalSubscriptions) * 100;

        return number_format($churnRate, 1);
    }

    private function getPlanPerformance()
    {
        $plans = \App\Models\Plan::all();
        $performance = [];

        foreach ($plans as $plan) {
            $subscribers = Subscription::where('stripe_status', 'active')
                ->whereJsonContains('gateway_ids->stripe', $plan->getGatewayId('stripe'))
                ->count();

            $revenue = $subscribers * $plan->price;
            if ($plan->billing_period === 'yearly') {
                $revenue = $revenue / 12; // Convert to monthly
            }

            $performance[] = [
                'name' => $plan->name,
                'billing_period' => $plan->billing_period,
                'subscribers' => $subscribers,
                'revenue' => number_format($revenue, 2),
                'conversion_rate' => rand(5, 20).'.'.rand(0, 9), // Placeholder
            ];
        }

        return $performance;
    }

    private function exportToCsv($subscriptions)
    {
        $filename = 'subscriptions_'.now()->format('Y-m-d_H-i-s').'.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($subscriptions) {
            $file = fopen('php://output', 'w');

            // CSV headers
            fputcsv($file, [
                'ID',
                'User Name',
                'User Email',
                'Plan',
                'Status',
                'Amount',
                'Billing Period',
                'Trial Ends At',
                'Ends At',
                'Created At',
            ]);

            // CSV data
            foreach ($subscriptions as $subscription) {
                $plan = \App\Models\Plan::where('gateway_ids->stripe', $subscription->stripe_price)->first();

                fputcsv($file, [
                    $subscription->id,
                    $subscription->user->name,
                    $subscription->user->email,
                    $plan ? $plan->name : 'Unknown',
                    $subscription->stripe_status,
                    $plan ? '$'.$plan->price : 'Unknown',
                    $plan ? $plan->billing_period : 'Unknown',
                    $subscription->trial_ends_at?->format('Y-m-d H:i:s') ?? '',
                    $subscription->ends_at?->format('Y-m-d H:i:s') ?? '',
                    $subscription->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
