<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    public function index()
    {
        // Get current settings from cache or database
        $settings = $this->getCurrentSettings();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            // General Settings
            'app_name' => 'required|string|max:255',
            'app_description' => 'nullable|string|max:1000',
            'app_url' => 'nullable|url|max:255',
            'timezone' => 'required|string|max:50',
            'date_format' => 'required|string|max:20',
            'time_format' => 'required|string|max:20',

            // Security Settings
            'session_lifetime' => 'required|integer|min:1|max:1440',
            'password_min_length' => 'required|integer|min:6|max:50',
            'require_email_verification' => 'boolean',
            'enable_two_factor' => 'boolean',
            'login_attempts' => 'required|integer|min:1|max:20',
            'lockout_duration' => 'required|integer|min:1',

            // Email Settings
            'mail_driver' => 'required|string|in:smtp,sendmail,mailgun,ses',
            'mail_host' => 'nullable|string|max:255',
            'mail_port' => 'nullable|integer|min:1|max:65535',
            'mail_username' => 'nullable|string|max:255',
            'mail_password' => 'nullable|string|max:255',
            'mail_encryption' => 'nullable|string|in:tls,ssl,none',
            'mail_from_address' => 'nullable|email|max:255',
            'mail_from_name' => 'nullable|string|max:255',

            // Notification Settings
            'notify_new_user' => 'boolean',
            'notify_new_subscription' => 'boolean',
            'notify_payment_failed' => 'boolean',
            'notify_system_errors' => 'boolean',

            // Appearance Settings
            'theme' => 'required|string|in:light,dark,auto',
            'primary_color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'sidebar_collapsed' => 'boolean',
            'show_breadcrumbs' => 'boolean',

            // System Settings
            'maintenance_mode' => 'boolean',
            'debug_mode' => 'boolean',
            'cache_enabled' => 'boolean',
            'log_level' => 'required|string|in:emergency,alert,critical,error,warning,notice,info,debug',
            'backup_enabled' => 'boolean',
            'backup_frequency' => 'required|string|in:hourly,daily,weekly,monthly',
        ]);

        // Save settings to database or cache
        $this->saveSettings($validated);

        return redirect()->route('admin.settings.index')
            ->with('success', 'Settings updated successfully.');
    }

    private function getCurrentSettings()
    {
        // In a real application, you would fetch these from a settings table or config files
        // For now, we'll return default values with some from config
        return [
            // General Settings
            'app_name' => config('app.name', 'Admin Panel'),
            'app_description' => '',
            'app_url' => config('app.url', ''),
            'timezone' => config('app.timezone', 'UTC'),
            'date_format' => 'Y-m-d',
            'time_format' => 'H:i:s',

            // Security Settings
            'session_lifetime' => config('session.lifetime', 120),
            'password_min_length' => 8,
            'require_email_verification' => true,
            'enable_two_factor' => false,
            'login_attempts' => 5,
            'lockout_duration' => 15,

            // Email Settings
            'mail_driver' => config('mail.default', 'smtp'),
            'mail_host' => config('mail.mailers.smtp.host', ''),
            'mail_port' => config('mail.mailers.smtp.port', 587),
            'mail_username' => config('mail.mailers.smtp.username', ''),
            'mail_password' => '', // Don't expose password
            'mail_encryption' => config('mail.mailers.smtp.encryption', 'tls'),
            'mail_from_address' => config('mail.from.address', ''),
            'mail_from_name' => config('mail.from.name', ''),

            // Notification Settings
            'notify_new_user' => true,
            'notify_new_subscription' => true,
            'notify_payment_failed' => true,
            'notify_system_errors' => true,

            // Appearance Settings
            'theme' => 'light',
            'primary_color' => '#3B82F6',
            'sidebar_collapsed' => false,
            'show_breadcrumbs' => true,

            // System Settings
            'maintenance_mode' => config('app.maintenance', false),
            'debug_mode' => config('app.debug', false),
            'cache_enabled' => true,
            'log_level' => config('logging.level', 'error'),
            'backup_enabled' => true,
            'backup_frequency' => 'daily',
        ];
    }

    private function saveSettings($settings)
    {
        // In a real application, you would save these to a database table
        // For now, we'll just cache them
        Cache::put('admin_settings', $settings, now()->addDays(30));

        // You could also update config files or environment variables here
        // For example, updating .env file for critical settings like APP_NAME, APP_URL, etc.

        // Example of updating some config values at runtime:
        Config::set('app.name', $settings['app_name']);
        Config::set('app.timezone', $settings['timezone']);

        // Log the settings update
        \Log::info('Admin settings updated', [
            'user_id' => auth()->id(),
            'settings_keys' => array_keys($settings),
        ]);
    }
}
