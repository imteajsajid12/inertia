<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'billing_period',
        'trial_days',
        'features',
        'gateway_ids',
        'is_active',
        'is_popular',
        'max_users',
        'max_projects',
        'storage_limit',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'gateway_ids' => 'array',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function getFormattedPriceAttribute()
    {
        return '$'.number_format($this->price, 2);
    }

    public function isFree()
    {
        return $this->billing_period === 'free' || $this->price == 0;
    }

    public function hasFeature($feature)
    {
        return in_array($feature, $this->features ?? []);
    }

    public function getGatewayId($gateway)
    {
        return $this->gateway_ids[$gateway] ?? null;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('price');
    }

    // Add accessor for billing_cycle to maintain compatibility
    public function getBillingCycleAttribute()
    {
        return $this->billing_period;
    }

    // Add mutator for billing_cycle to maintain compatibility
    public function setBillingCycleAttribute($value)
    {
        $this->attributes['billing_period'] = $value;
    }

    // Get subscription count for this plan
    public function getSubscriptionsCountAttribute()
    {
        // Since Laravel Cashier doesn't have direct plan relationships,
        // we'll count subscriptions by matching the stripe_price with gateway IDs
        $stripePrice = $this->getGatewayId('stripe');

        if (! $stripePrice) {
            return 0;
        }

        return \Laravel\Cashier\Subscription::where('stripe_price', $stripePrice)
            ->where('stripe_status', 'active')
            ->count();
    }
}
