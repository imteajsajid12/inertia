<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use Billable, HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'status',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's current plan
     */
    public function currentPlan()
    {
        $subscription = $this->subscription('default');
        if (! $subscription || ! $subscription->valid()) {
            return null;
        }

        return Plan::where('slug', $subscription->stripe_price)->first();
    }

    /**
     * Check if user has an active subscription
     */
    public function hasActiveSubscription()
    {
        return $this->subscribed('default');
    }

    /**
     * Check if user is on trial
     */
    public function onTrial()
    {
        return $this->onTrial('default');
    }

    /**
     * Get subscription status
     */
    public function getSubscriptionStatus()
    {
        $subscription = $this->subscription('default');

        if (! $subscription) {
            return 'none';
        }

        if ($subscription->onTrial()) {
            return 'trial';
        }

        if ($subscription->active()) {
            return 'active';
        }

        if ($subscription->canceled()) {
            return 'canceled';
        }

        if ($subscription->pastDue()) {
            return 'past_due';
        }

        return 'inactive';
    }

    /**
     * Check if user is admin
     */
    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user is client
     */
    public function isClient()
    {
        return $this->hasRole('client');
    }
}
