import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import {
    UserIcon,
    CreditCardIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XMarkIcon,
    ClockIcon,
    ArrowPathIcon,
    BanknotesIcon,
    ReceiptPercentIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Show = ({ subscription, invoices = [], paymentMethods = [] }) => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const getStatusBadge = (status) => {
        const variants = {
            active: { variant: 'success', icon: CheckCircleIcon, label: 'Active', color: 'text-green-600' },
            canceled: { variant: 'danger', icon: XMarkIcon, label: 'Canceled', color: 'text-red-600' },
            past_due: { variant: 'warning', icon: ExclamationTriangleIcon, label: 'Past Due', color: 'text-yellow-600' },
            unpaid: { variant: 'danger', icon: ExclamationTriangleIcon, label: 'Unpaid', color: 'text-red-600' },
            trialing: { variant: 'info', icon: ClockIcon, label: 'Trial', color: 'text-blue-600' },
            incomplete: { variant: 'warning', icon: ClockIcon, label: 'Incomplete', color: 'text-yellow-600' },
            incomplete_expired: { variant: 'danger', icon: XMarkIcon, label: 'Expired', color: 'text-red-600' },
        };

        const config = variants[status] || variants.active;
        const IconComponent = config.icon;

        return {
            badge: (
                <Badge variant={config.variant} className="flex items-center">
                    <IconComponent className="w-3 h-3 mr-1" />
                    {config.label}
                </Badge>
            ),
            color: config.color
        };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount / 100);
    };

    const handleCancel = async () => {
        setLoading(true);
        try {
            await router.patch(`/admin/subscriptions/${subscription.id}/cancel`);
            setShowCancelModal(false);
        } finally {
            setLoading(false);
        }
    };

    const handleResume = async () => {
        setLoading(true);
        try {
            await router.patch(`/admin/subscriptions/${subscription.id}/resume`);
        } finally {
            setLoading(false);
        }
    };

    const statusInfo = getStatusBadge(subscription.stripe_status);

    const breadcrumbs = [
        { label: 'Subscriptions', href: '/admin/subscriptions' },
        { label: subscription.user?.name || 'Subscription', href: null }
    ];

    return (
        <AdminLayout title={`Subscription - ${subscription.user?.name}`} breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                            <CreditCardIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {subscription.user?.name}'s Subscription
                            </h1>
                            <div className="flex items-center space-x-3 mt-2">
                                {statusInfo.badge}
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    ID: {subscription.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {subscription.stripe_status === 'active' && !subscription.ends_at && (
                            <Button
                                variant="danger"
                                onClick={() => setShowCancelModal(true)}
                            >
                                <XMarkIcon className="w-4 h-4 mr-2" />
                                Cancel Subscription
                            </Button>
                        )}

                        {subscription.stripe_status === 'canceled' && subscription.ends_at && new Date(subscription.ends_at) > new Date() && (
                            <Button
                                variant="success"
                                onClick={handleResume}
                                loading={loading}
                            >
                                <ArrowPathIcon className="w-4 h-4 mr-2" />
                                Resume Subscription
                            </Button>
                        )}

                        <Link href={`/admin/users/${subscription.user?.id}`}>
                            <Button variant="outline">
                                <UserIcon className="w-4 h-4 mr-2" />
                                View User
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Subscription Details */}
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center space-x-2 mb-6">
                                    <CreditCardIcon className="w-5 h-5 text-gray-400" />
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subscription Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan</label>
                                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                            {subscription.plan?.name || 'Unknown Plan'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {subscription.stripe_price}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</label>
                                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(subscription.quantity * (subscription.plan?.price || 0))}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            per {subscription.plan?.billing_period || 'month'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                        <div className="mt-1">
                                            {statusInfo.badge}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</label>
                                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                            {subscription.quantity}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center space-x-2 mb-6">
                                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Timeline</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-navy-700 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Created</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Subscription started</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(subscription.created_at)}
                                        </p>
                                    </div>

                                    {subscription.trial_ends_at && (
                                        <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div>
                                                <p className="font-medium text-blue-900 dark:text-blue-100">Trial Period</p>
                                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                                    {new Date(subscription.trial_ends_at) > new Date() ? 'Trial active' : 'Trial ended'}
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                {formatDate(subscription.trial_ends_at)}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-navy-700 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Current Period</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {subscription.ends_at ? 'Ends' : 'Renews'}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(subscription.ends_at || subscription.current_period_end)}
                                        </p>
                                    </div>

                                    {subscription.ends_at && (
                                        <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                            <div>
                                                <p className="font-medium text-red-900 dark:text-red-100">Cancellation</p>
                                                <p className="text-sm text-red-700 dark:text-red-300">Subscription will end</p>
                                            </div>
                                            <p className="text-sm font-medium text-red-900 dark:text-red-100">
                                                {formatDate(subscription.ends_at)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Recent Invoices */}
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2">
                                        <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Invoices</h2>
                                    </div>
                                    <Link href={`/admin/subscriptions/${subscription.id}/invoices`}>
                                        <Button variant="outline" size="sm">View All</Button>
                                    </Link>
                                </div>

                                {invoices && invoices.length > 0 ? (
                                    <div className="space-y-3">
                                        {invoices.slice(0, 5).map((invoice) => (
                                            <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-navy-700 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className={clsx(
                                                        'w-8 h-8 rounded-lg flex items-center justify-center',
                                                        invoice.status === 'paid'
                                                            ? 'bg-green-100 dark:bg-green-900/20'
                                                            : 'bg-red-100 dark:bg-red-900/20'
                                                    )}>
                                                        <ReceiptPercentIcon className={clsx(
                                                            'w-4 h-4',
                                                            invoice.status === 'paid'
                                                                ? 'text-green-600 dark:text-green-400'
                                                                : 'text-red-600 dark:text-red-400'
                                                        )} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {formatCurrency(invoice.amount_paid)}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(invoice.created)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant={invoice.status === 'paid' ? 'success' : 'danger'}>
                                                        {invoice.status}
                                                    </Badge>
                                                    <Button variant="outline" size="sm">
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                        No invoices found
                                    </p>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* User Info */}
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <UserIcon className="w-5 h-5 text-gray-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer</h3>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {subscription.user?.name || 'Unknown'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {subscription.user?.email || 'Unknown'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID</p>
                                        <p className="font-mono text-sm text-gray-900 dark:text-white">
                                            {subscription.stripe_id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <BanknotesIcon className="w-5 h-5 text-gray-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</h3>
                                </div>

                                {paymentMethods && paymentMethods.length > 0 ? (
                                    <div className="space-y-3">
                                        {paymentMethods[0] && (
                                            <div className="p-3 bg-gray-50 dark:bg-navy-700 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
                                                        <CreditCardIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            •••• •••• •••• {paymentMethods[0].last4}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {paymentMethods[0].brand?.toUpperCase()} • Expires {paymentMethods[0].exp_month}/{paymentMethods[0].exp_year}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        No payment method on file
                                    </p>
                                )}
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                                </div>

                                <div className="space-y-2">
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <DocumentTextIcon className="w-4 h-4 mr-2" />
                                        Send Invoice
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                                        Process Payment
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                        Change Plan
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Cancel Confirmation Modal */}
                <Modal.Confirm
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={handleCancel}
                    title="Cancel Subscription"
                    message={`Are you sure you want to cancel ${subscription.user?.name}'s subscription? This action will cancel the subscription at the end of the current billing period.`}
                    confirmText="Cancel Subscription"
                    cancelText="Keep Active"
                    variant="danger"
                    loading={loading}
                />
            </div>
        </AdminLayout>
    );
};

export default Show;