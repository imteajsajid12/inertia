<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SubscriptionService
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function subscribe(User $user, Plan $plan, array $options = [])
    {
        DB::beginTransaction();

        try {
            // Cancel existing subscription if any
            if ($user->hasActiveSubscription()) {
                $this->cancel($user);
            }

            $gateway = $options['gateway'] ?? 'stripe';
            $result = $this->paymentService->createSubscription($user, $plan, $gateway, $options);

            DB::commit();

            return $result;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function changePlan(User $user, Plan $newPlan, array $options = [])
    {
        $currentSubscription = $user->subscription('default');

        if (! $currentSubscription || ! $currentSubscription->valid()) {
            throw new \Exception('No active subscription found');
        }

        $gateway = $options['gateway'] ?? 'stripe';

        return $this->paymentService->updateSubscription(
            $user,
            $currentSubscription->id,
            $newPlan,
            $gateway
        );
    }

    public function cancel(User $user, $immediately = false)
    {
        $subscription = $user->subscription('default');

        if (! $subscription) {
            throw new \Exception('No subscription found');
        }

        if ($immediately) {
            return $subscription->cancelNow();
        }

        return $subscription->cancel();
    }

    public function resume(User $user)
    {
        $subscription = $user->subscription('default');

        if (! $subscription || ! $subscription->canceled()) {
            throw new \Exception('No canceled subscription found');
        }

        return $subscription->resume();
    }

    public function getSubscriptionDetails(User $user)
    {
        $subscription = $user->subscription('default');

        if (! $subscription) {
            return null;
        }

        $plan = $user->currentPlan();

        return [
            'subscription' => $subscription,
            'plan' => $plan,
            'status' => $user->getSubscriptionStatus(),
            'next_billing_date' => $subscription->asStripeSubscription()->current_period_end,
            'trial_ends_at' => $subscription->trial_ends_at,
            'ends_at' => $subscription->ends_at,
        ];
    }

    public function getInvoices(User $user)
    {
        return $user->invoices();
    }

    public function downloadInvoice(User $user, $invoiceId)
    {
        return $user->downloadInvoice($invoiceId, [
            'vendor' => config('app.name'),
            'product' => 'Subscription',
        ]);
    }

    public function canUpgrade(User $user, Plan $newPlan)
    {
        $currentPlan = $user->currentPlan();

        if (! $currentPlan) {
            return true;
        }

        return $newPlan->price > $currentPlan->price;
    }

    public function canDowngrade(User $user, Plan $newPlan)
    {
        $currentPlan = $user->currentPlan();

        if (! $currentPlan) {
            return false;
        }

        return $newPlan->price < $currentPlan->price;
    }
}
