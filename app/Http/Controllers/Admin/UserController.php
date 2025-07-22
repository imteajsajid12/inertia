<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    /**
     * Display a listing of users with search and filters
     */
    public function index(Request $request)
    {
        $query = User::with(['roles', 'permissions', 'subscriptions']);

        // Search functionality
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%')
                    ->orWhere('id', 'like', '%'.$request->search.'%');
            });
        }

        // Role filter
        if ($request->role) {
            $query->role($request->role);
        }

        // Status filter
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Subscription status filter
        if ($request->subscription_status) {
            switch ($request->subscription_status) {
                case 'active':
                    $query->whereHas('subscriptions', function ($q) {
                        $q->where('stripe_status', 'active');
                    });
                    break;
                case 'trial':
                    $query->whereHas('subscriptions', function ($q) {
                        $q->where('stripe_status', 'trialing');
                    });
                    break;
                case 'canceled':
                    $query->whereHas('subscriptions', function ($q) {
                        $q->where('stripe_status', 'canceled');
                    });
                    break;
                case 'expired':
                    $query->whereHas('subscriptions', function ($q) {
                        $q->where('stripe_status', 'past_due')
                            ->orWhere('stripe_status', 'unpaid');
                    });
                    break;
                case 'none':
                    $query->whereDoesntHave('subscriptions');
                    break;
            }
        }

        $users = $query->latest()
            ->paginate(15)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? null,
                    'address' => $user->address ?? null,
                    'status' => $user->status ?? 'active',
                    'roles' => $user->roles,
                    'role' => $user->roles->first()?->name ?? 'user',
                    'permissions' => $user->getAllPermissions(),
                    'subscription_status' => $user->getSubscriptionStatus(),
                    'current_plan' => $user->currentPlan()?->name ?? 'Free',
                    'total_spent' => $user->subscriptions->sum('amount') ?? 0,
                    'last_login' => $user->last_login_at ?? null,
                    'created_at' => $user->created_at->toISOString(),
                    'updated_at' => $user->updated_at->toISOString(),
                    'email_verified_at' => $user->email_verified_at?->toISOString(),
                ];
            });

        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();

        // Statistics
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
            'subscribed_users' => User::whereHas('subscriptions', function ($q) {
                $q->where('stripe_status', 'active');
            })->count(),
            'new_users_today' => User::whereDate('created_at', today())->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'permissions' => $permissions,
            'stats' => $stats,
            'filters' => $request->only(['search', 'role', 'status', 'subscription_status']),
        ]);
    }

    /**
     * Show the form for creating a new user
     */
    public function create()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();

        return Inertia::render('Admin/Users/Create', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'status' => 'required|in:active,inactive,pending,suspended',
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'send_welcome_email' => 'boolean',
        ]);

        DB::beginTransaction();

        try {
            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'status' => $request->status,
                'password' => Hash::make($request->password),
                'email_verified_at' => now(), // Auto-verify admin created users
            ]);

            // Assign role
            $role = Role::findById($request->role_id);
            $user->assignRole($role);

            // Assign custom permissions if provided
            if ($request->permissions) {
                $permissions = Permission::whereIn('id', $request->permissions)->get();
                $user->givePermissionTo($permissions);
            }

            // Send welcome email if requested
            if ($request->send_welcome_email) {
                // You can implement welcome email logic here
                // Mail::to($user)->send(new WelcomeEmail($user, $request->password));
            }

            DB::commit();

            return redirect()->route('admin.users.index')
                ->with('success', 'User created successfully.');

        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors(['error' => 'Failed to create user: '.$e->getMessage()]);
        }
    }

    /**
     * Display the specified user
     */
    public function show(User $user)
    {
        $user->load(['roles.permissions', 'permissions', 'subscriptions']);

        // Get subscription history
        $subscriptions = $user->subscriptions->map(function ($subscription) {
            return [
                'id' => $subscription->id,
                'plan_name' => $subscription->name ?? 'Unknown Plan',
                'status' => $subscription->stripe_status,
                'amount' => $subscription->quantity * 100, // Convert to cents for display
                'created_at' => $subscription->created_at->toISOString(),
                'trial_ends_at' => $subscription->trial_ends_at?->toISOString(),
                'ends_at' => $subscription->ends_at?->toISOString(),
            ];
        });

        // Get recent activities (you can implement activity logging)
        $activities = [
            // This would come from an activity log table
            // For now, we'll use dummy data
        ];

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'status' => $user->status ?? 'active',
                'roles' => $user->roles,
                'role' => $user->roles->first()?->name ?? 'user',
                'permissions' => $user->getAllPermissions(),
                'subscription_status' => $user->getSubscriptionStatus(),
                'current_plan' => $user->currentPlan()?->name ?? 'Free',
                'total_spent' => $user->subscriptions->sum('amount') ?? 0,
                'last_login' => $user->last_login_at,
                'created_at' => $user->created_at->toISOString(),
                'updated_at' => $user->updated_at->toISOString(),
                'email_verified_at' => $user->email_verified_at?->toISOString(),
            ],
            'subscriptions' => $subscriptions,
            'activities' => $activities,
        ]);
    }

    /**
     * Show the form for editing the specified user
     */
    public function edit(User $user)
    {
        $user->load(['roles', 'permissions']);
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();

        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'status' => $user->status ?? 'active',
                'roles' => $user->roles,
                'permissions' => $user->getAllPermissions(),
                'created_at' => $user->created_at->toISOString(),
                'updated_at' => $user->updated_at->toISOString(),
                'email_verified_at' => $user->email_verified_at?->toISOString(),
            ],
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'status' => 'required|in:active,inactive,pending,suspended',
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'send_welcome_email' => 'boolean',
        ]);

        DB::beginTransaction();

        try {
            // Update user basic info
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'status' => $request->status,
            ];

            // Update password if provided
            if ($request->password) {
                $userData['password'] = Hash::make($request->password);
            }

            $user->update($userData);

            // Update role
            $role = Role::findById($request->role_id);
            $user->syncRoles([$role]);

            // Update permissions
            if ($request->permissions) {
                $permissions = Permission::whereIn('id', $request->permissions)->get();
                $user->syncPermissions($permissions);
            } else {
                $user->syncPermissions([]);
            }

            // Send password reset email if requested and password was changed
            if ($request->send_welcome_email && $request->password) {
                // You can implement password reset email logic here
                // Mail::to($user)->send(new PasswordResetEmail($user));
            }

            DB::commit();

            return redirect()->route('admin.users.show', $user)
                ->with('success', 'User updated successfully.');

        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors(['error' => 'Failed to update user: '.$e->getMessage()]);
        }
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user)
    {
        // Prevent deleting admin user
        if ($user->id === 1) {
            return back()->withErrors(['error' => 'Cannot delete the primary admin user.']);
        }

        // Prevent deleting current user
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Cannot delete your own account.']);
        }

        DB::beginTransaction();

        try {
            // Cancel any active subscriptions
            if ($user->subscribed()) {
                $user->subscription()->cancel();
            }

            // Remove roles and permissions
            $user->syncRoles([]);
            $user->syncPermissions([]);

            // Delete user
            $user->delete();

            DB::commit();

            return redirect()->route('admin.users.index')
                ->with('success', 'User deleted successfully.');

        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors(['error' => 'Failed to delete user: '.$e->getMessage()]);
        }
    }

    /**
     * Update user role (AJAX endpoint)
     */
    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user->syncRoles([$request->role]);

        return response()->json([
            'success' => true,
            'message' => 'User role updated successfully.',
            'user' => [
                'id' => $user->id,
                'role' => $user->roles->first()?->name ?? 'user',
            ],
        ]);
    }

    /**
     * Export users to CSV
     */
    public function export(Request $request)
    {
        $query = User::with(['roles', 'subscriptions']);

        // Apply same filters as index
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%')
                    ->orWhere('id', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->role) {
            $query->role($request->role);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->subscription_status) {
            switch ($request->subscription_status) {
                case 'active':
                    $query->whereHas('subscriptions', function ($q) {
                        $q->where('stripe_status', 'active');
                    });
                    break;
                case 'trial':
                    $query->whereHas('subscriptions', function ($q) {
                        $q->where('stripe_status', 'trialing');
                    });
                    break;
                case 'canceled':
                    $query->whereHas('subscriptions', function ($q) {
                        $q->where('stripe_status', 'canceled');
                    });
                    break;
                case 'expired':
                    $query->whereHas('subscriptions', function ($q) {
                        $q->where('stripe_status', 'past_due')
                            ->orWhere('stripe_status', 'unpaid');
                    });
                    break;
                case 'none':
                    $query->whereDoesntHave('subscriptions');
                    break;
            }
        }

        $users = $query->latest()->get();

        $response = new StreamedResponse(function () use ($users) {
            $handle = fopen('php://output', 'w');

            // Add CSV headers
            fputcsv($handle, [
                'ID',
                'Name',
                'Email',
                'Phone',
                'Address',
                'Status',
                'Role',
                'Subscription Status',
                'Current Plan',
                'Total Spent',
                'Email Verified',
                'Created At',
                'Updated At',
            ]);

            // Add user data
            foreach ($users as $user) {
                fputcsv($handle, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->phone ?? '',
                    $user->address ?? '',
                    $user->status ?? 'active',
                    $user->roles->first()?->name ?? 'user',
                    $user->getSubscriptionStatus(),
                    $user->currentPlan()?->name ?? 'Free',
                    $user->subscriptions->sum('amount') ?? 0,
                    $user->email_verified_at ? 'Yes' : 'No',
                    $user->created_at->format('Y-m-d H:i:s'),
                    $user->updated_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="users-'.date('Y-m-d').'.csv"');

        return $response;
    }
}
