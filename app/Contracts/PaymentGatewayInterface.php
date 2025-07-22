<?php

namespace App\Contracts;

use App\Models\Plan;
use App\Models\User;

interface PaymentGatewayInterface
{
    /**
     * Create a subscription for the user
     */
    public function createSubscription(User $user, Plan $plan, array $options = []);

    /**
     * Cancel a subscription
     */
    public function cancelSubscription(User $user, $subscriptionId);

    /**
     * Resume a subscription
     */
    public function resumeSubscription(User $user, $subscriptionId);

    /**
     * Update subscription plan
     */
    public function updateSubscription(User $user, $subscriptionId, Plan $newPlan);

    /**
     * Get subscription details
     */
    public function getSubscription(User $user, $subscriptionId);

    /**
     * Create a payment intent for one-time payments
     */
    public function createPaymentIntent(User $user, $amount, array $options = []);

    /**
     * Get payment history for user
     */
    public function getPaymentHistory(User $user);

    /**
     * Verify webhook signature
     */
    public function verifyWebhook($payload, $signature);

    /**
     * Handle webhook events
     */
    public function handleWebhook($payload);
}
