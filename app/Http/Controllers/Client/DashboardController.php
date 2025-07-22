<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Services\SubscriptionService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->middleware(['auth', 'role:client']);
        $this->subscriptionService = $subscriptionService;
    }

    public function index()
    {
        $user = auth()->user();
        $subscriptionDetails = $this->subscriptionService->getSubscriptionDetails($user);

        $availablePlans = Plan::active()
            ->ordered()
            ->get()
            ->map(function ($plan) use ($user) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'description' => $plan->description,
                    'price' => $plan->formatted_price,
                    'billing_cycle' => $plan->billing_cycle,
                    'trial_days' => $plan->trial_days,
                    'features' => $plan->features,
                    'is_current' => $user->currentPlan()?->id === $plan->id,
                    'can_upgrade' => $this->subscriptionService->canUpgrade($user, $plan),
                    'can_downgrade' => $this->subscriptionService->canDowngrade($user, $plan),
                ];
            });

        return Inertia::render('Client/Dashboard', [
            'subscription' => $subscriptionDetails ? [
                'status' => $subscriptionDetails['status'],
                'plan' => $subscriptionDetails['plan'] ? [
                    'name' => $subscriptionDetails['plan']->name,
                    'price' => $subscriptionDetails['plan']->formatted_price,
                    'billing_cycle' => $subscriptionDetails['plan']->billing_cycle,
                    'features' => $subscriptionDetails['plan']->features,
                ] : null,
                'next_billing_date' => $subscriptionDetails['next_billing_date'] ? date('M d, Y', $subscriptionDetails['next_billing_date']) : null,
                'trial_ends_at' => $subscriptionDetails['trial_ends_at']?->format('M d, Y'),
                'ends_at' => $subscriptionDetails['ends_at']?->format('M d, Y'),
            ] : null,
            'plans' => $availablePlans,
        ]);
    }
}
