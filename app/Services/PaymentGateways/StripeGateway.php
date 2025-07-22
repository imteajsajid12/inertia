<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Plan;
use App\Models\User;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Stripe\Stripe;
use Stripe\Webhook;

class StripeGateway implements PaymentGatewayInterface
{
    public function __construct()
    {
        Stripe::setApiKey(config('cashier.secret'));
    }

    public function createSubscription(User $user, Plan $plan, array $options = [])
    {
        try {
            $stripePrice = $plan->getGatewayId('stripe');

            if (! $stripePrice) {
                throw new \Exception('Stripe price ID not found for plan: '.$plan->name);
            }

            $subscription = $user->newSubscription('default', $stripePrice);

            if ($plan->trial_days > 0) {
                $subscription->trialDays($plan->trial_days);
            }

            return $subscription->create($options['payment_method'] ?? null);

        } catch (IncompletePayment $exception) {
            return [
                'status' => 'incomplete',
                'payment_intent' => $exception->payment->id,
                'client_secret' => $exception->payment->client_secret,
            ];
        }
    }

    public function cancelSubscription(User $user, $subscriptionId)
    {
        $subscription = $user->subscription('default');

        if ($subscription) {
            return $subscription->cancel();
        }

        return false;
    }

    public function resumeSubscription(User $user, $subscriptionId)
    {
        $subscription = $user->subscription('default');

        if ($subscription && $subscription->canceled()) {
            return $subscription->resume();
        }

        return false;
    }

    public function updateSubscription(User $user, $subscriptionId, Plan $newPlan)
    {
        $subscription = $user->subscription('default');
        $stripePrice = $newPlan->getGatewayId('stripe');

        if (! $stripePrice) {
            throw new \Exception('Stripe price ID not found for plan: '.$newPlan->name);
        }

        if ($subscription) {
            return $subscription->swap($stripePrice);
        }

        return false;
    }

    public function getSubscription(User $user, $subscriptionId)
    {
        return $user->subscription('default');
    }

    public function createPaymentIntent(User $user, $amount, array $options = [])
    {
        return $user->createSetupIntent();
    }

    public function getPaymentHistory(User $user)
    {
        return $user->invoices();
    }

    public function verifyWebhook($payload, $signature)
    {
        return Webhook::constructEvent(
            $payload,
            $signature,
            config('cashier.webhook.secret')
        );
    }

    public function handleWebhook($payload)
    {
        // Handle Stripe webhook events
        // This will be expanded based on specific needs
        return response('Webhook handled');
    }
}
