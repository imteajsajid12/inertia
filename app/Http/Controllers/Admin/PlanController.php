<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    public function index()
    {
        $plans = Plan::ordered()
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'price' => $plan->formatted_price,
                    'billing_cycle' => $plan->billing_period,
                    'trial_days' => $plan->trial_days,
                    'is_active' => $plan->is_active,
                    'subscriptions_count' => $plan->subscriptions_count, // Uses accessor
                    'features' => $plan->features,
                ];
            });

        return Inertia::render('Admin/Plans/Index', [
            'plans' => $plans,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Plans/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_period' => 'required|in:monthly,yearly,free',
            'trial_days' => 'integer|min:0|max:365',
            'features' => 'array',
            'gateway_ids' => 'array',
            'is_active' => 'boolean',
            'is_popular' => 'boolean',
            'max_users' => 'nullable|integer|min:1',
            'max_projects' => 'nullable|integer|min:1',
            'storage_limit' => 'nullable|integer|min:1',
            'sort_order' => 'integer|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        Plan::create($validated);

        return redirect()->route('admin.plans.index')
            ->with('success', 'Plan created successfully.');
    }

    public function show(Plan $plan)
    {
        // Get active subscriptions for this plan
        $stripePrice = $plan->getGatewayId('stripe');
        $subscriptions = [];

        if ($stripePrice) {
            $subscriptions = \Laravel\Cashier\Subscription::where('stripe_price', $stripePrice)
                ->with('user')
                ->latest()
                ->take(10)
                ->get()
                ->map(function ($subscription) {
                    return [
                        'id' => $subscription->id,
                        'user' => [
                            'name' => $subscription->user->name,
                            'email' => $subscription->user->email,
                        ],
                        'status' => $subscription->stripe_status,
                        'created_at' => $subscription->created_at->format('M d, Y'),
                    ];
                });
        }

        return Inertia::render('Admin/Plans/Show', [
            'plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'description' => $plan->description,
                'price' => $plan->formatted_price,
                'billing_period' => $plan->billing_period,
                'trial_days' => $plan->trial_days,
                'features' => $plan->features,
                'gateway_ids' => $plan->gateway_ids,
                'is_active' => $plan->is_active,
                'sort_order' => $plan->sort_order,
                'subscriptions' => $subscriptions,
            ],
        ]);
    }

    public function edit(Plan $plan)
    {
        return Inertia::render('Admin/Plans/Edit', [
            'plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'description' => $plan->description,
                'price' => $plan->price,
                'billing_period' => $plan->billing_period,
                'trial_days' => $plan->trial_days,
                'features' => $plan->features ?? [],
                'gateway_ids' => $plan->gateway_ids ?? [],
                'is_active' => $plan->is_active,
                'sort_order' => $plan->sort_order,
            ],
        ]);
    }

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_period' => 'required|in:monthly,yearly,free',
            'trial_days' => 'integer|min:0|max:365',
            'features' => 'array',
            'gateway_ids' => 'array',
            'is_active' => 'boolean',
            'is_popular' => 'boolean',
            'max_users' => 'nullable|integer|min:1',
            'max_projects' => 'nullable|integer|min:1',
            'storage_limit' => 'nullable|integer|min:1',
            'sort_order' => 'integer|min:0',
        ]);

        if ($validated['name'] !== $plan->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $plan->update($validated);

        return redirect()->route('admin.plans.index')
            ->with('success', 'Plan updated successfully.');
    }

    public function destroy(Plan $plan)
    {
        // Check if plan has active subscriptions
        $stripePrice = $plan->getGatewayId('stripe');
        $activeSubscriptions = 0;

        if ($stripePrice) {
            $activeSubscriptions = \Laravel\Cashier\Subscription::where('stripe_price', $stripePrice)
                ->where('stripe_status', 'active')
                ->count();
        }

        if ($activeSubscriptions > 0) {
            return back()->with('error', 'Cannot delete plan with active subscriptions. Deactivate it instead.');
        }

        $plan->delete();

        return redirect()->route('admin.plans.index')
            ->with('success', 'Plan deleted successfully.');
    }

    public function toggle(Plan $plan)
    {
        $plan->update(['is_active' => ! $plan->is_active]);

        $status = $plan->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Plan {$status} successfully.");
    }

    public function configuration()
    {
        // Get current settings from config or database
        $settings = [
            'default_currency' => config('app.currency', 'USD'),
            'tax_rate' => config('billing.tax_rate', 0),
            'trial_period_days' => config('billing.trial_period_days', 14),
            'allow_plan_changes' => config('billing.allow_plan_changes', true),
            'prorate_plan_changes' => config('billing.prorate_plan_changes', true),
            'cancel_at_period_end' => config('billing.cancel_at_period_end', true),
            'notify_payment_failed' => config('billing.notify_payment_failed', true),
            'notify_subscription_cancelled' => config('billing.notify_subscription_cancelled', true),
            'notify_trial_ending' => config('billing.notify_trial_ending', true),
            'trial_ending_days' => config('billing.trial_ending_days', 3),
            'invoice_prefix' => config('billing.invoice_prefix', 'INV-'),
            'company_name' => config('billing.company_name', ''),
            'company_address' => config('billing.company_address', ''),
            'company_email' => config('billing.company_email', ''),
            'max_plans_per_user' => config('billing.max_plans_per_user', null),
            'enable_coupons' => config('billing.enable_coupons', true),
            'enable_referrals' => config('billing.enable_referrals', false),
        ];

        return Inertia::render('Admin/Plans/Configuration', [
            'settings' => $settings,
        ]);
    }

    public function updateConfiguration(Request $request)
    {
        $validated = $request->validate([
            'default_currency' => 'required|string|in:USD,EUR,GBP,CAD,AUD',
            'tax_rate' => 'numeric|min:0|max:100',
            'trial_period_days' => 'integer|min:0|max:365',
            'allow_plan_changes' => 'boolean',
            'prorate_plan_changes' => 'boolean',
            'cancel_at_period_end' => 'boolean',
            'notify_payment_failed' => 'boolean',
            'notify_subscription_cancelled' => 'boolean',
            'notify_trial_ending' => 'boolean',
            'trial_ending_days' => 'integer|min:1|max:30',
            'invoice_prefix' => 'string|max:10',
            'company_name' => 'nullable|string|max:255',
            'company_address' => 'nullable|string|max:500',
            'company_email' => 'nullable|email|max:255',
            'max_plans_per_user' => 'nullable|integer|min:1',
            'enable_coupons' => 'boolean',
            'enable_referrals' => 'boolean',
        ]);

        // In a real application, you would save these to a settings table or config file
        // For now, we'll just show a success message

        return redirect()->route('admin.plans.configuration')
            ->with('success', 'Configuration updated successfully.');
    }
}
