<?php

namespace App\Services;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Plan;
use App\Models\User;
use App\Services\PaymentGateways\StripeGateway;

class PaymentService
{
    protected $gateways = [];

    protected $defaultGateway = 'stripe';

    public function __construct()
    {
        $this->gateways = [
            'stripe' => new StripeGateway,
            // Add other gateways here
            // 'paypal' => new PayPalGateway(),
            // 'bkash' => new BkashGateway(),
            // 'sslcommerz' => new SSLCommerzGateway(),
        ];
    }

    public function getGateway($gateway = null): PaymentGatewayInterface
    {
        $gateway = $gateway ?: $this->defaultGateway;

        if (! isset($this->gateways[$gateway])) {
            throw new \Exception("Payment gateway '{$gateway}' not found");
        }

        return $this->gateways[$gateway];
    }

    public function createSubscription(User $user, Plan $plan, $gateway = null, array $options = [])
    {
        return $this->getGateway($gateway)->createSubscription($user, $plan, $options);
    }

    public function cancelSubscription(User $user, $subscriptionId, $gateway = null)
    {
        return $this->getGateway($gateway)->cancelSubscription($user, $subscriptionId);
    }

    public function resumeSubscription(User $user, $subscriptionId, $gateway = null)
    {
        return $this->getGateway($gateway)->resumeSubscription($user, $subscriptionId);
    }

    public function updateSubscription(User $user, $subscriptionId, Plan $newPlan, $gateway = null)
    {
        return $this->getGateway($gateway)->updateSubscription($user, $subscriptionId, $newPlan);
    }

    public function getAvailableGateways()
    {
        return array_keys($this->gateways);
    }

    public function getPaymentHistory(User $user, $gateway = null)
    {
        return $this->getGateway($gateway)->getPaymentHistory($user);
    }
}
