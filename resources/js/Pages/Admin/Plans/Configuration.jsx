import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import FormInput from '@/Components/Forms/FormInput';
import FormSelect from '@/Components/Forms/FormSelect';
import Checkbox from '@/Components/Checkbox';
import {
    Cog6ToothIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    BellIcon,
    DocumentTextIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

const Configuration = ({ settings = {} }) => {
    const { data, setData, post, processing, errors } = useForm({
        // Payment Settings
        default_currency: settings.default_currency || 'USD',
        tax_rate: settings.tax_rate || 0,
        trial_period_days: settings.trial_period_days || 14,

        // Plan Settings
        allow_plan_changes: settings.allow_plan_changes ?? true,
        prorate_plan_changes: settings.prorate_plan_changes ?? true,
        cancel_at_period_end: settings.cancel_at_period_end ?? true,

        // Notification Settings
        notify_payment_failed: settings.notify_payment_failed ?? true,
        notify_subscription_cancelled: settings.notify_subscription_cancelled ?? true,
        notify_trial_ending: settings.notify_trial_ending ?? true,
        trial_ending_days: settings.trial_ending_days || 3,

        // Invoice Settings
        invoice_prefix: settings.invoice_prefix || 'INV-',
        company_name: settings.company_name || '',
        company_address: settings.company_address || '',
        company_email: settings.company_email || '',

        // Feature Limits
        max_plans_per_user: settings.max_plans_per_user || null,
        enable_coupons: settings.enable_coupons ?? true,
        enable_referrals: settings.enable_referrals ?? false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/plans-configuration');
    };

    const breadcrumbs = [
        { label: 'Plans Management', href: '/admin/plans' },
        { label: 'Configuration', href: null }
    ];

    return (
        <AdminLayout title="Plans Configuration" breadcrumbs={breadcrumbs}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                            <Cog6ToothIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Plans Configuration</h1>
                            <p className="text-gray-600 dark:text-gray-400">Configure global settings for subscription plans</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Payment Settings */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Settings</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormSelect
                                    label="Default Currency"
                                    value={data.default_currency}
                                    onChange={(e) => setData('default_currency', e.target.value)}
                                    error={errors.default_currency}
                                    options={[
                                        { value: 'USD', label: 'USD - US Dollar' },
                                        { value: 'EUR', label: 'EUR - Euro' },
                                        { value: 'GBP', label: 'GBP - British Pound' },
                                        { value: 'CAD', label: 'CAD - Canadian Dollar' },
                                        { value: 'AUD', label: 'AUD - Australian Dollar' },
                                    ]}
                                />

                                <FormInput
                                    label="Tax Rate (%)"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={data.tax_rate}
                                    onChange={(e) => setData('tax_rate', e.target.value)}
                                    error={errors.tax_rate}
                                    placeholder="0.00"
                                />

                                <FormInput
                                    label="Default Trial Period (Days)"
                                    type="number"
                                    min="0"
                                    max="365"
                                    value={data.trial_period_days}
                                    onChange={(e) => setData('trial_period_days', e.target.value)}
                                    error={errors.trial_period_days}
                                    placeholder="14"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Plan Management Settings */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Plan Management</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="allow_plan_changes"
                                        checked={data.allow_plan_changes}
                                        onChange={(e) => setData('allow_plan_changes', e.target.checked)}
                                    />
                                    <div className="ml-3">
                                        <label htmlFor="allow_plan_changes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Allow Plan Changes
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Allow users to upgrade or downgrade their plans
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Checkbox
                                        id="prorate_plan_changes"
                                        checked={data.prorate_plan_changes}
                                        onChange={(e) => setData('prorate_plan_changes', e.target.checked)}
                                    />
                                    <div className="ml-3">
                                        <label htmlFor="prorate_plan_changes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Prorate Plan Changes
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Automatically prorate charges when users change plans
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Checkbox
                                        id="cancel_at_period_end"
                                        checked={data.cancel_at_period_end}
                                        onChange={(e) => setData('cancel_at_period_end', e.target.checked)}
                                    />
                                    <div className="ml-3">
                                        <label htmlFor="cancel_at_period_end" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Cancel at Period End
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Cancel subscriptions at the end of the billing period instead of immediately
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <BellIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="notify_payment_failed"
                                        checked={data.notify_payment_failed}
                                        onChange={(e) => setData('notify_payment_failed', e.target.checked)}
                                    />
                                    <div className="ml-3">
                                        <label htmlFor="notify_payment_failed" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Payment Failed Notifications
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Send notifications when payments fail
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Checkbox
                                        id="notify_subscription_cancelled"
                                        checked={data.notify_subscription_cancelled}
                                        onChange={(e) => setData('notify_subscription_cancelled', e.target.checked)}
                                    />
                                    <div className="ml-3">
                                        <label htmlFor="notify_subscription_cancelled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Subscription Cancelled Notifications
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Send notifications when subscriptions are cancelled
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center">
                                        <Checkbox
                                            id="notify_trial_ending"
                                            checked={data.notify_trial_ending}
                                            onChange={(e) => setData('notify_trial_ending', e.target.checked)}
                                        />
                                        <div className="ml-3">
                                            <label htmlFor="notify_trial_ending" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Trial Ending Notifications
                                            </label>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Send notifications before trials end
                                            </p>
                                        </div>
                                    </div>

                                    <FormInput
                                        label="Days Before Trial Ends"
                                        type="number"
                                        min="1"
                                        max="30"
                                        value={data.trial_ending_days}
                                        onChange={(e) => setData('trial_ending_days', e.target.value)}
                                        error={errors.trial_ending_days}
                                        placeholder="3"
                                        disabled={!data.notify_trial_ending}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Invoice Settings */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Invoice Settings</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Invoice Prefix"
                                    value={data.invoice_prefix}
                                    onChange={(e) => setData('invoice_prefix', e.target.value)}
                                    error={errors.invoice_prefix}
                                    placeholder="INV-"
                                />

                                <FormInput
                                    label="Company Name"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    error={errors.company_name}
                                    placeholder="Your Company Name"
                                />

                                <FormInput
                                    label="Company Email"
                                    type="email"
                                    value={data.company_email}
                                    onChange={(e) => setData('company_email', e.target.value)}
                                    error={errors.company_email}
                                    placeholder="billing@company.com"
                                />

                                <FormInput
                                    label="Company Address"
                                    value={data.company_address}
                                    onChange={(e) => setData('company_address', e.target.value)}
                                    error={errors.company_address}
                                    placeholder="123 Business St, City, State 12345"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Feature Settings */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Feature Settings</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Max Plans Per User"
                                    type="number"
                                    min="1"
                                    value={data.max_plans_per_user || ''}
                                    onChange={(e) => setData('max_plans_per_user', e.target.value || null)}
                                    error={errors.max_plans_per_user}
                                    placeholder="Unlimited"
                                    helpText="Leave empty for unlimited"
                                />

                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <Checkbox
                                            id="enable_coupons"
                                            checked={data.enable_coupons}
                                            onChange={(e) => setData('enable_coupons', e.target.checked)}
                                        />
                                        <div className="ml-3">
                                            <label htmlFor="enable_coupons" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Enable Coupons
                                            </label>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Allow discount coupons for subscriptions
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Checkbox
                                            id="enable_referrals"
                                            checked={data.enable_referrals}
                                            onChange={(e) => setData('enable_referrals', e.target.checked)}
                                        />
                                        <div className="ml-3">
                                            <label htmlFor="enable_referrals" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Enable Referrals
                                            </label>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Allow users to refer others for rewards
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={processing}
                            className="shadow-lg"
                        >
                            Save Configuration
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default Configuration;