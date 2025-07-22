import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import FormInput from '@/Components/Forms/FormInput';
import FormTextarea from '@/Components/Forms/FormTextarea';
import FormSelect from '@/Components/Forms/FormSelect';
import Checkbox from '@/Components/Checkbox';
import {
    Cog6ToothIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    BellIcon,
    EnvelopeIcon,
    CurrencyDollarIcon,
    PaintBrushIcon,
    ServerIcon,
    KeyIcon,
    DocumentTextIcon,
    CloudIcon,
    DevicePhoneMobileIcon,
    ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const SettingSection = ({ title, description, icon: Icon, children, className = '' }) => (
    <Card className={className}>
        <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                </div>
            </div>
            {children}
        </div>
    </Card>
);

const ToggleSetting = ({ id, label, description, checked, onChange, disabled = false }) => (
    <div className={clsx('flex items-start space-x-3', disabled && 'opacity-50')}>
        <Checkbox
            id={id}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
        />
        <div className="flex-1">
            <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                {label}
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {description}
            </p>
        </div>
    </div>
);

const Settings = ({ settings = {} }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        // General Settings
        app_name: settings.app_name || 'Admin Panel',
        app_description: settings.app_description || '',
        app_url: settings.app_url || '',
        timezone: settings.timezone || 'UTC',
        date_format: settings.date_format || 'Y-m-d',
        time_format: settings.time_format || 'H:i:s',

        // Security Settings
        session_lifetime: settings.session_lifetime || 120,
        password_min_length: settings.password_min_length || 8,
        require_email_verification: settings.require_email_verification ?? true,
        enable_two_factor: settings.enable_two_factor ?? false,
        login_attempts: settings.login_attempts || 5,
        lockout_duration: settings.lockout_duration || 15,

        // Email Settings
        mail_driver: settings.mail_driver || 'smtp',
        mail_host: settings.mail_host || '',
        mail_port: settings.mail_port || 587,
        mail_username: settings.mail_username || '',
        mail_password: settings.mail_password || '',
        mail_encryption: settings.mail_encryption || 'tls',
        mail_from_address: settings.mail_from_address || '',
        mail_from_name: settings.mail_from_name || '',

        // Notification Settings
        notify_new_user: settings.notify_new_user ?? true,
        notify_new_subscription: settings.notify_new_subscription ?? true,
        notify_payment_failed: settings.notify_payment_failed ?? true,
        notify_system_errors: settings.notify_system_errors ?? true,

        // Appearance Settings
        theme: settings.theme || 'light',
        primary_color: settings.primary_color || '#3B82F6',
        sidebar_collapsed: settings.sidebar_collapsed ?? false,
        show_breadcrumbs: settings.show_breadcrumbs ?? true,

        // System Settings
        maintenance_mode: settings.maintenance_mode ?? false,
        debug_mode: settings.debug_mode ?? false,
        cache_enabled: settings.cache_enabled ?? true,
        log_level: settings.log_level || 'error',
        backup_enabled: settings.backup_enabled ?? true,
        backup_frequency: settings.backup_frequency || 'daily',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        post('/admin/settings', {
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        });
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Cog6ToothIcon },
        { id: 'security', label: 'Security', icon: ShieldCheckIcon },
        { id: 'email', label: 'Email', icon: EnvelopeIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
        { id: 'appearance', label: 'Appearance', icon: PaintBrushIcon },
        { id: 'system', label: 'System', icon: ServerIcon },
    ];

    const breadcrumbs = [
        { label: 'Settings', href: null }
    ];

    return (
        <AdminLayout title="Settings" breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Configure your application settings and preferences
                        </p>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        loading={loading || processing}
                        className="shadow-lg"
                    >
                        Save Changes
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <Card className="p-4">
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const IconComponent = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={clsx(
                                                'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
                                                activeTab === tab.id
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700'
                                            )}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </Card>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* General Settings */}
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <SettingSection
                                        title="Application Information"
                                        description="Basic information about your application"
                                        icon={GlobeAltIcon}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput
                                                label="Application Name"
                                                value={data.app_name}
                                                onChange={(e) => setData('app_name', e.target.value)}
                                                error={errors.app_name}
                                                placeholder="My Admin Panel"
                                            />
                                            <FormInput
                                                label="Application URL"
                                                value={data.app_url}
                                                onChange={(e) => setData('app_url', e.target.value)}
                                                error={errors.app_url}
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                        <FormTextarea
                                            label="Description"
                                            value={data.app_description}
                                            onChange={(e) => setData('app_description', e.target.value)}
                                            error={errors.app_description}
                                            placeholder="Describe your application..."
                                            rows={3}
                                        />
                                    </SettingSection>

                                    <SettingSection
                                        title="Localization"
                                        description="Date, time, and timezone settings"
                                        icon={GlobeAltIcon}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <FormSelect
                                                label="Timezone"
                                                value={data.timezone}
                                                onChange={(e) => setData('timezone', e.target.value)}
                                                error={errors.timezone}
                                                options={[
                                                    { value: 'UTC', label: 'UTC' },
                                                    { value: 'America/New_York', label: 'Eastern Time' },
                                                    { value: 'America/Chicago', label: 'Central Time' },
                                                    { value: 'America/Denver', label: 'Mountain Time' },
                                                    { value: 'America/Los_Angeles', label: 'Pacific Time' },
                                                    { value: 'Europe/London', label: 'London' },
                                                    { value: 'Europe/Paris', label: 'Paris' },
                                                    { value: 'Asia/Tokyo', label: 'Tokyo' },
                                                ]}
                                            />
                                            <FormSelect
                                                label="Date Format"
                                                value={data.date_format}
                                                onChange={(e) => setData('date_format', e.target.value)}
                                                error={errors.date_format}
                                                options={[
                                                    { value: 'Y-m-d', label: '2024-01-15' },
                                                    { value: 'm/d/Y', label: '01/15/2024' },
                                                    { value: 'd/m/Y', label: '15/01/2024' },
                                                    { value: 'F j, Y', label: 'January 15, 2024' },
                                                ]}
                                            />
                                            <FormSelect
                                                label="Time Format"
                                                value={data.time_format}
                                                onChange={(e) => setData('time_format', e.target.value)}
                                                error={errors.time_format}
                                                options={[
                                                    { value: 'H:i:s', label: '24-hour (14:30:00)' },
                                                    { value: 'g:i A', label: '12-hour (2:30 PM)' },
                                                ]}
                                            />
                                        </div>
                                    </SettingSection>
                                </div>
                            )}

                            {/* Security Settings */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <SettingSection
                                        title="Authentication"
                                        description="User authentication and session settings"
                                        icon={ShieldCheckIcon}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput
                                                label="Session Lifetime (minutes)"
                                                type="number"
                                                value={data.session_lifetime}
                                                onChange={(e) => setData('session_lifetime', e.target.value)}
                                                error={errors.session_lifetime}
                                                min="1"
                                            />
                                            <FormInput
                                                label="Password Minimum Length"
                                                type="number"
                                                value={data.password_min_length}
                                                onChange={(e) => setData('password_min_length', e.target.value)}
                                                error={errors.password_min_length}
                                                min="6"
                                                max="50"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <ToggleSetting
                                                id="require_email_verification"
                                                label="Require Email Verification"
                                                description="Users must verify their email address before accessing the application"
                                                checked={data.require_email_verification}
                                                onChange={(e) => setData('require_email_verification', e.target.checked)}
                                            />
                                            <ToggleSetting
                                                id="enable_two_factor"
                                                label="Enable Two-Factor Authentication"
                                                description="Allow users to enable 2FA for additional security"
                                                checked={data.enable_two_factor}
                                                onChange={(e) => setData('enable_two_factor', e.target.checked)}
                                            />
                                        </div>
                                    </SettingSection>

                                    <SettingSection
                                        title="Login Protection"
                                        description="Protect against brute force attacks"
                                        icon={KeyIcon}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput
                                                label="Max Login Attempts"
                                                type="number"
                                                value={data.login_attempts}
                                                onChange={(e) => setData('login_attempts', e.target.value)}
                                                error={errors.login_attempts}
                                                min="1"
                                                max="20"
                                            />
                                            <FormInput
                                                label="Lockout Duration (minutes)"
                                                type="number"
                                                value={data.lockout_duration}
                                                onChange={(e) => setData('lockout_duration', e.target.value)}
                                                error={errors.lockout_duration}
                                                min="1"
                                            />
                                        </div>
                                    </SettingSection>
                                </div>
                            )}

                            {/* Email Settings */}
                            {activeTab === 'email' && (
                                <div className="space-y-6">
                                    <SettingSection
                                        title="Mail Configuration"
                                        description="Configure email delivery settings"
                                        icon={EnvelopeIcon}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormSelect
                                                label="Mail Driver"
                                                value={data.mail_driver}
                                                onChange={(e) => setData('mail_driver', e.target.value)}
                                                error={errors.mail_driver}
                                                options={[
                                                    { value: 'smtp', label: 'SMTP' },
                                                    { value: 'sendmail', label: 'Sendmail' },
                                                    { value: 'mailgun', label: 'Mailgun' },
                                                    { value: 'ses', label: 'Amazon SES' },
                                                ]}
                                            />
                                            <FormInput
                                                label="Mail Host"
                                                value={data.mail_host}
                                                onChange={(e) => setData('mail_host', e.target.value)}
                                                error={errors.mail_host}
                                                placeholder="smtp.gmail.com"
                                            />
                                            <FormInput
                                                label="Mail Port"
                                                type="number"
                                                value={data.mail_port}
                                                onChange={(e) => setData('mail_port', e.target.value)}
                                                error={errors.mail_port}
                                                placeholder="587"
                                            />
                                            <FormSelect
                                                label="Encryption"
                                                value={data.mail_encryption}
                                                onChange={(e) => setData('mail_encryption', e.target.value)}
                                                error={errors.mail_encryption}
                                                options={[
                                                    { value: 'tls', label: 'TLS' },
                                                    { value: 'ssl', label: 'SSL' },
                                                    { value: 'none', label: 'None' },
                                                ]}
                                            />
                                            <FormInput
                                                label="Username"
                                                value={data.mail_username}
                                                onChange={(e) => setData('mail_username', e.target.value)}
                                                error={errors.mail_username}
                                                placeholder="your-email@gmail.com"
                                            />
                                            <FormInput
                                                label="Password"
                                                type="password"
                                                value={data.mail_password}
                                                onChange={(e) => setData('mail_password', e.target.value)}
                                                error={errors.mail_password}
                                                placeholder="••••••••"
                                            />
                                            <FormInput
                                                label="From Address"
                                                value={data.mail_from_address}
                                                onChange={(e) => setData('mail_from_address', e.target.value)}
                                                error={errors.mail_from_address}
                                                placeholder="noreply@example.com"
                                            />
                                            <FormInput
                                                label="From Name"
                                                value={data.mail_from_name}
                                                onChange={(e) => setData('mail_from_name', e.target.value)}
                                                error={errors.mail_from_name}
                                                placeholder="Admin Panel"
                                            />
                                        </div>
                                    </SettingSection>
                                </div>
                            )}

                            {/* Notification Settings */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <SettingSection
                                        title="Email Notifications"
                                        description="Configure when to send email notifications"
                                        icon={BellIcon}
                                    >
                                        <div className="space-y-4">
                                            <ToggleSetting
                                                id="notify_new_user"
                                                label="New User Registration"
                                                description="Send notification when a new user registers"
                                                checked={data.notify_new_user}
                                                onChange={(e) => setData('notify_new_user', e.target.checked)}
                                            />
                                            <ToggleSetting
                                                id="notify_new_subscription"
                                                label="New Subscription"
                                                description="Send notification when a user subscribes to a plan"
                                                checked={data.notify_new_subscription}
                                                onChange={(e) => setData('notify_new_subscription', e.target.checked)}
                                            />
                                            <ToggleSetting
                                                id="notify_payment_failed"
                                                label="Payment Failed"
                                                description="Send notification when a payment fails"
                                                checked={data.notify_payment_failed}
                                                onChange={(e) => setData('notify_payment_failed', e.target.checked)}
                                            />
                                            <ToggleSetting
                                                id="notify_system_errors"
                                                label="System Errors"
                                                description="Send notification when system errors occur"
                                                checked={data.notify_system_errors}
                                                onChange={(e) => setData('notify_system_errors', e.target.checked)}
                                            />
                                        </div>
                                    </SettingSection>
                                </div>
                            )}

                            {/* Appearance Settings */}
                            {activeTab === 'appearance' && (
                                <div className="space-y-6">
                                    <SettingSection
                                        title="Theme & Layout"
                                        description="Customize the look and feel of your admin panel"
                                        icon={PaintBrushIcon}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormSelect
                                                label="Theme"
                                                value={data.theme}
                                                onChange={(e) => setData('theme', e.target.value)}
                                                error={errors.theme}
                                                options={[
                                                    { value: 'light', label: 'Light' },
                                                    { value: 'dark', label: 'Dark' },
                                                    { value: 'auto', label: 'Auto (System)' },
                                                ]}
                                            />
                                            <FormInput
                                                label="Primary Color"
                                                type="color"
                                                value={data.primary_color}
                                                onChange={(e) => setData('primary_color', e.target.value)}
                                                error={errors.primary_color}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <ToggleSetting
                                                id="sidebar_collapsed"
                                                label="Collapsed Sidebar by Default"
                                                description="Start with the sidebar collapsed on desktop"
                                                checked={data.sidebar_collapsed}
                                                onChange={(e) => setData('sidebar_collapsed', e.target.checked)}
                                            />
                                            <ToggleSetting
                                                id="show_breadcrumbs"
                                                label="Show Breadcrumbs"
                                                description="Display breadcrumb navigation on pages"
                                                checked={data.show_breadcrumbs}
                                                onChange={(e) => setData('show_breadcrumbs', e.target.checked)}
                                            />
                                        </div>
                                    </SettingSection>
                                </div>
                            )}

                            {/* System Settings */}
                            {activeTab === 'system' && (
                                <div className="space-y-6">
                                    <SettingSection
                                        title="System Configuration"
                                        description="Advanced system settings and maintenance"
                                        icon={ServerIcon}
                                    >
                                        <div className="space-y-4">
                                            <ToggleSetting
                                                id="maintenance_mode"
                                                label="Maintenance Mode"
                                                description="Put the application in maintenance mode"
                                                checked={data.maintenance_mode}
                                                onChange={(e) => setData('maintenance_mode', e.target.checked)}
                                            />
                                            <ToggleSetting
                                                id="debug_mode"
                                                label="Debug Mode"
                                                description="Enable debug mode for development (not recommended for production)"
                                                checked={data.debug_mode}
                                                onChange={(e) => setData('debug_mode', e.target.checked)}
                                            />
                                            <ToggleSetting
                                                id="cache_enabled"
                                                label="Cache Enabled"
                                                description="Enable application caching for better performance"
                                                checked={data.cache_enabled}
                                                onChange={(e) => setData('cache_enabled', e.target.checked)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormSelect
                                                label="Log Level"
                                                value={data.log_level}
                                                onChange={(e) => setData('log_level', e.target.value)}
                                                error={errors.log_level}
                                                options={[
                                                    { value: 'emergency', label: 'Emergency' },
                                                    { value: 'alert', label: 'Alert' },
                                                    { value: 'critical', label: 'Critical' },
                                                    { value: 'error', label: 'Error' },
                                                    { value: 'warning', label: 'Warning' },
                                                    { value: 'notice', label: 'Notice' },
                                                    { value: 'info', label: 'Info' },
                                                    { value: 'debug', label: 'Debug' },
                                                ]}
                                            />
                                            <FormSelect
                                                label="Backup Frequency"
                                                value={data.backup_frequency}
                                                onChange={(e) => setData('backup_frequency', e.target.value)}
                                                error={errors.backup_frequency}
                                                options={[
                                                    { value: 'hourly', label: 'Hourly' },
                                                    { value: 'daily', label: 'Daily' },
                                                    { value: 'weekly', label: 'Weekly' },
                                                    { value: 'monthly', label: 'Monthly' },
                                                ]}
                                                disabled={!data.backup_enabled}
                                            />
                                        </div>
                                        <ToggleSetting
                                            id="backup_enabled"
                                            label="Automatic Backups"
                                            description="Enable automatic database backups"
                                            checked={data.backup_enabled}
                                            onChange={(e) => setData('backup_enabled', e.target.checked)}
                                        />
                                    </SettingSection>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Settings;