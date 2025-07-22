<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AnalyticsService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->middleware(['auth', 'role:admin']);
        $this->analyticsService = $analyticsService;
    }

    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'active_subscriptions' => User::whereHas('subscriptions', function ($query) {
                $query->where('stripe_status', 'active');
            })->count(),
            'mrr' => $this->analyticsService->calculateMRR(),
            'total_revenue' => $this->analyticsService->getTotalRevenue(),
        ];

        $recentUsers = User::with('roles')
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first()?->name ?? 'client',
                    'subscription_status' => $user->getSubscriptionStatus(),
                    'created_at' => $user->created_at->format('M d, Y'),
                ];
            });

        $recentSubscriptions = User::whereHas('subscriptions')
            ->with(['subscriptions' => function ($query) {
                $query->latest()->take(1);
            }])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($user) {
                $subscription = $user->subscriptions->first();

                return [
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'status' => $subscription->stripe_status,
                    'created_at' => $subscription->created_at->format('M d, Y'),
                ];
            });

        $chartData = $this->analyticsService->getRevenueChart();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentSubscriptions' => $recentSubscriptions,
            'chartData' => $chartData,
        ]);
    }
}
