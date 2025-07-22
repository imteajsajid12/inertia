<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = auth()->user();

    if ($user->hasRole('admin')) {
        return redirect()->route('admin.dashboard');
    }

    return redirect()->route('client.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    // Plan Management
    Route::resource('plans', App\Http\Controllers\Admin\PlanController::class);
    Route::patch('plans/{plan}/toggle', [App\Http\Controllers\Admin\PlanController::class, 'toggle'])->name('plans.toggle');
    Route::get('plans-configuration', [App\Http\Controllers\Admin\PlanController::class, 'configuration'])->name('plans.configuration');
    Route::post('plans-configuration', [App\Http\Controllers\Admin\PlanController::class, 'updateConfiguration'])->name('plans.configuration.update');

    // User Management
    Route::resource('users', App\Http\Controllers\Admin\UserController::class);
    Route::patch('/users/{user}/role', [App\Http\Controllers\Admin\UserController::class, 'updateRole'])->name('users.role');
    Route::get('/users-export', [App\Http\Controllers\Admin\UserController::class, 'export'])->name('users.export');

    // Role & Permission Management
    Route::resource('roles', App\Http\Controllers\Admin\RoleController::class);
    Route::resource('permissions', App\Http\Controllers\Admin\PermissionController::class);

    // Settings Management
    Route::get('/settings', [App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');

    // Subscription Management
    Route::get('/subscriptions', [App\Http\Controllers\Admin\SubscriptionController::class, 'index'])->name('subscriptions.index');
    Route::get('/subscriptions/analytics', [App\Http\Controllers\Admin\SubscriptionController::class, 'analytics'])->name('subscriptions.analytics');
    Route::get('/subscriptions/export', [App\Http\Controllers\Admin\SubscriptionController::class, 'export'])->name('subscriptions.export');
    Route::get('/subscriptions/table-demo', function () {
        return \Inertia\Inertia::render('Admin/Subscriptions/TableDemo');
    })->name('subscriptions.table-demo');
    Route::get('/subscriptions/{subscription}', [App\Http\Controllers\Admin\SubscriptionController::class, 'show'])->name('subscriptions.show');
    Route::patch('/subscriptions/{subscription}/cancel', [App\Http\Controllers\Admin\SubscriptionController::class, 'cancel'])->name('subscriptions.cancel');
    Route::patch('/subscriptions/{subscription}/resume', [App\Http\Controllers\Admin\SubscriptionController::class, 'resume'])->name('subscriptions.resume');
});

// Client Routes
Route::middleware(['auth', 'role:client'])->prefix('client')->name('client.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Client\DashboardController::class, 'index'])->name('dashboard');

    // Subscription Management
    Route::get('/plans', [App\Http\Controllers\Client\SubscriptionController::class, 'plans'])->name('plans');
    Route::post('/subscribe/{plan}', [App\Http\Controllers\Client\SubscriptionController::class, 'subscribe'])->name('subscribe');
    Route::patch('/change-plan/{plan}', [App\Http\Controllers\Client\SubscriptionController::class, 'changePlan'])->name('change-plan');
    Route::delete('/cancel', [App\Http\Controllers\Client\SubscriptionController::class, 'cancel'])->name('cancel');
    Route::post('/resume', [App\Http\Controllers\Client\SubscriptionController::class, 'resume'])->name('resume');

    // Billing
    Route::get('/invoices', [App\Http\Controllers\Client\SubscriptionController::class, 'invoices'])->name('invoices');
    Route::get('/invoices/{invoice}/download', [App\Http\Controllers\Client\SubscriptionController::class, 'downloadInvoice'])->name('invoices.download');
    Route::get('/payment-methods', [App\Http\Controllers\Client\SubscriptionController::class, 'paymentMethods'])->name('payment-methods');
});

require __DIR__.'/auth.php';
