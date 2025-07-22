<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    protected $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->middleware(['auth', 'role:client']);
        $this->subscriptionService = $subscriptionService;
    }

    public function plans()
    {
        $user = auth()->user();
        $currentPlan = $user->currentPlan();

        $plans = Plan::active()
            ->ordered()
            ->get()
            ->map(function ($plan) use ($user, $currentPlan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'description' => $plan->description,
                    'price' => $plan->formatted_price,
                    'billing_cycle' => $plan->billing_cycle,
                    'trial_days' => $plan->trial_days,
                    'features' => $plan->features,
                    'is_current' => $currentPlan?->id === $plan->id,
                    'can_upgrade' => $this->subscriptionService->canUpgrade($user, $plan),
                    'can_downgrade' => $this->subscriptionService->canDowngrade($user, $plan),
                ];
            });

        return Inertia::render('Client/Plans', [
            'plans' => $plans,
            'currentPlan' => $currentPlan,
            'subscriptionStatus' => $user->getSubscriptionStatus(),
        ]);
    }

    public function subscribe(Request $request, Plan $plan)
    {
        $request->validate([
            'payment_method' => 'required|string',
            'gateway' => 'string|in:stripe,paypal,bkash,sslcommerz',
        ]);

        try {
            $user = auth()->user();

            $result = $this->subscriptionService->subscribe($user, $plan, [
                'payment_method' => $request->payment_method,
                'gateway' => $request->gateway ?? 'stripe',
            ]);

            if (is_array($result) && $result['status'] === 'incomplete') {
                return response()->json([
                    'status' => 'incomplete',
                    'payment_intent' => $result['payment_intent'],
                    'client_secret' => $result['client_secret'],
                ]);
            }

            return redirect()->route('client.dashboard')
                ->with('success', 'Successfully subscribed to '.$plan->name);

        } catch (\Exception $e) {
            return back()->with('error', 'Subscription failed: '.$e->getMessage());
        }
    }

    public function changePlan(Request $request, Plan $plan)
    {
        $request->validate([
            'gateway' => 'string|in:stripe,paypal,bkash,sslcommerz',
        ]);

        try {
            $user = auth()->user();

            $this->subscriptionService->changePlan($user, $plan, [
                'gateway' => $request->gateway ?? 'stripe',
            ]);

            return redirect()->route('client.dashboard')
                ->with('success', 'Plan changed to '.$plan->name);

        } catch (\Exception $e) {
            return back()->with('error', 'Plan change failed: '.$e->getMessage());
        }
    }

    public function cancel(Request $request)
    {
        try {
            $user = auth()->user();
            $immediately = $request->boolean('immediately', false);

            $this->subscriptionService->cancel($user, $immediately);

            $message = $immediately
                ? 'Subscription canceled immediately'
                : 'Subscription will be canceled at the end of the current billing period';

            return redirect()->route('client.dashboard')
                ->with('success', $message);

        } catch (\Exception $e) {
            return back()->with('error', 'Cancellation failed: '.$e->getMessage());
        }
    }

    public function resume()
    {
        try {
            $user = auth()->user();

            $this->subscriptionService->resume($user);

            return redirect()->route('client.dashboard')
                ->with('success', 'Subscription resumed successfully');

        } catch (\Exception $e) {
            return back()->with('error', 'Resume failed: '.$e->getMessage());
        }
    }

    public function invoices()
    {
        $user = auth()->user();
        $invoices = $this->subscriptionService->getInvoices($user);

        $formattedInvoices = collect($invoices)->map(function ($invoice) {
            return [
                'id' => $invoice->id,
                'date' => $invoice->date()->format('M d, Y'),
                'total' => $invoice->total(),
                'status' => $invoice->status,
                'download_url' => route('client.invoices.download', $invoice->id),
            ];
        });

        return Inertia::render('Client/Invoices', [
            'invoices' => $formattedInvoices,
        ]);
    }

    public function downloadInvoice($invoiceId)
    {
        try {
            $user = auth()->user();

            return $this->subscriptionService->downloadInvoice($user, $invoiceId);

        } catch (\Exception $e) {
            return back()->with('error', 'Invoice download failed: '.$e->getMessage());
        }
    }

    public function paymentMethods()
    {
        $user = auth()->user();
        $paymentMethods = $user->paymentMethods();
        $defaultPaymentMethod = $user->defaultPaymentMethod();

        return Inertia::render('Client/PaymentMethods', [
            'paymentMethods' => $paymentMethods->map(function ($pm) {
                return [
                    'id' => $pm->id,
                    'type' => $pm->type,
                    'card' => $pm->card ? [
                        'brand' => $pm->card->brand,
                        'last4' => $pm->card->last4,
                        'exp_month' => $pm->card->exp_month,
                        'exp_year' => $pm->card->exp_year,
                    ] : null,
                ];
            }),
            'defaultPaymentMethod' => $defaultPaymentMethod?->id,
            'intent' => $user->createSetupIntent(),
        ]);
    }
}
