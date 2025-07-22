<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Free Trial',
                'slug' => 'free-trial',
                'description' => 'Try our service for free with limited features',
                'price' => 0.00,
                'billing_period' => 'free',
                'trial_days' => 14,
                'features' => [
                    'Up to 5 projects',
                    'Basic support',
                    '1GB storage',
                    'Email notifications',
                ],
                'gateway_ids' => [
                    'stripe' => null, // Free plans don't need Stripe price IDs
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'description' => 'Perfect for individuals and small teams',
                'price' => 9.99,
                'billing_period' => 'monthly',
                'trial_days' => 7,
                'features' => [
                    'Up to 25 projects',
                    'Priority support',
                    '10GB storage',
                    'Email & SMS notifications',
                    'Basic analytics',
                ],
                'gateway_ids' => [
                    'stripe' => 'price_basic_monthly', // Replace with actual Stripe price ID
                ],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Basic (Yearly)',
                'slug' => 'basic-yearly',
                'description' => 'Basic plan billed annually - Save 20%',
                'price' => 95.90,
                'billing_period' => 'yearly',
                'trial_days' => 7,
                'features' => [
                    'Up to 25 projects',
                    'Priority support',
                    '10GB storage',
                    'Email & SMS notifications',
                    'Basic analytics',
                    '2 months free',
                ],
                'gateway_ids' => [
                    'stripe' => 'price_basic_yearly', // Replace with actual Stripe price ID
                ],
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Professional',
                'slug' => 'professional',
                'description' => 'For growing businesses and teams',
                'price' => 29.99,
                'billing_period' => 'monthly',
                'trial_days' => 7,
                'features' => [
                    'Unlimited projects',
                    '24/7 priority support',
                    '100GB storage',
                    'All notification types',
                    'Advanced analytics',
                    'Team collaboration',
                    'API access',
                ],
                'gateway_ids' => [
                    'stripe' => 'price_pro_monthly', // Replace with actual Stripe price ID
                ],
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Professional (Yearly)',
                'slug' => 'professional-yearly',
                'description' => 'Professional plan billed annually - Save 20%',
                'price' => 287.90,
                'billing_period' => 'yearly',
                'trial_days' => 7,
                'features' => [
                    'Unlimited projects',
                    '24/7 priority support',
                    '100GB storage',
                    'All notification types',
                    'Advanced analytics',
                    'Team collaboration',
                    'API access',
                    '2 months free',
                ],
                'gateway_ids' => [
                    'stripe' => 'price_pro_yearly', // Replace with actual Stripe price ID
                ],
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'description' => 'For large organizations with custom needs',
                'price' => 99.99,
                'billing_period' => 'monthly',
                'trial_days' => 14,
                'features' => [
                    'Unlimited everything',
                    'Dedicated support manager',
                    'Unlimited storage',
                    'Custom integrations',
                    'Advanced analytics & reporting',
                    'Team collaboration',
                    'Full API access',
                    'Custom branding',
                    'SLA guarantee',
                ],
                'gateway_ids' => [
                    'stripe' => 'price_enterprise_monthly', // Replace with actual Stripe price ID
                ],
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($plans as $planData) {
            Plan::create($planData);
        }

        $this->command->info('Sample subscription plans created successfully!');
        $this->command->info('Note: Update gateway_ids with actual payment gateway price IDs before going live.');
    }
}
