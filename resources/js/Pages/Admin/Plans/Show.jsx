import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import {
    PencilIcon,
    TrashIcon,
    CreditCardIcon,
    UsersIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    SparklesIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    DocumentTextIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Show = ({ plan, subscriptions = [], analytics = {} }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            await router.patch(`/admin/plans/${plan.id}/toggle`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        router.delete(`/admin/plans/${plan.id}`);
        setShowDeleteModal(false);
    };

    const getBillingCycleBadge = (cycle) => {
        const variants = {
            monthly: { variant: 'primary', icon: CalendarIcon, label: 'Monthly' },
            yearly: { variant: 'success', icon: CalendarIcon, label: 'Yearly' },
            free: { variant: 'info', icon: SparklesIcon, label: 'Free' },
        };
        const config = variants[cycle] || variants.monthly;
        const IconComponent = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center">
                <IconComponent className="w-3 h-3 mr-1" />
                {config.label}
            </Badge>
        );
    };

    const getStatusBadge = (isActive) => (
        <Badge variant={isActive ? 'success' : 'danger'} className="flex items-center">
            {isActive ? (
                <CheckCircleIcon className="w-3 h-3 mr-1" />
            ) : (
                <XCircleIcon className="w-3 h-3 mr-1" />
            )}
            {isActive ? 'Active' : 'Inactive'}
        </Badge>
    );

    const breadcrumbs = [
        { label: 'Plans Management', href: '/admin/plans' },
        { label: plan.name, href: null }
    ];

    return (
        <AdminLayout title={plan.name} breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={clsx(
                            'w-16 h-16 rounded-2xl flex items-center justify-center',
                            plan.billing_period === 'free'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                                : plan.billing_period === 'yearly'
                                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                                    : 'bg-gradient-to-br from-purple-500 to-purple-600'
                        )}>
                            <CreditCardIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{plan.name}</h1>
                                {plan.is_popular && (
                                    <Badge variant="primary" className="flex items-center">
                                        <SparklesIcon className="w-3 h-3 mr-1" />
                                        Popular
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center space-x-3">
                                {getBillingCycleBadge(plan.billing_period)}
                                {getStatusBadge(plan.is_active)}
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Slug: {plan.slug}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button
                            variant={plan.is_active ? 'danger' : 'success'}
                            onClick={handleToggle}
                            loading={loading}
                        >
                            {plan.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Link href={`/admin/plans/${plan.id}/edit`}>
                            <Button variant="outline">
                                <PencilIcon className="w-4 h-4 mr-2" />
                                Edit Plan
                            </Button>
                        </Link>
                        <Button
                            variant="danger"
                            onClick={() => setShowDeleteModal(true)}
                            disabled={plan.subscriptions_count > 0}
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                                        <CurrencyDollarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ${plan.price}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Per {plan.billing_period}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center">
                                        <UsersIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {plan.subscriptions_count || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Active Subscribers
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center">
                                        <ClockIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {plan.trial_days}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Trial Days
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl flex items-center justify-center">
                                        <ChartBarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ${((plan.subscriptions_count || 0) * parseFloat(plan.price.replace('$', '') || 0)).toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Monthly Revenue
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Plan Details */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Plan Details</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {plan.description || 'No description provided'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {new Date(plan.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {new Date(plan.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Features */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <CheckCircleIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Features</h2>
                            </div>

                            {plan.features && plan.features.length > 0 ? (
                                <div className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                                            <CheckCircleIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No features defined</p>
                            )}
                        </div>
                    </Card>

                    {/* Limits */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Limits</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Max Users</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {plan.max_users || 'Unlimited'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Max Projects</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {plan.max_projects || 'Unlimited'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Storage Limit</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {plan.storage_limit ? `${plan.storage_limit} GB` : 'Unlimited'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Recent Subscriptions */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-2">
                                    <UsersIcon className="w-5 h-5 text-gray-400" />
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Subscriptions</h2>
                                </div>
                                {subscriptions.length > 0 && (
                                    <Link href={`/admin/subscriptions?plan=${plan.id}`}>
                                        <Button variant="outline" size="sm">View All</Button>
                                    </Link>
                                )}
                            </div>

                            {subscriptions.length > 0 ? (
                                <div className="space-y-3">
                                    {subscriptions.slice(0, 5).map((subscription) => (
                                        <div key={subscription.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-navy-700 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {subscription.user?.name || 'Unknown User'}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(subscription.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
                                                {subscription.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No subscriptions yet</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Delete Confirmation Modal */}
                <Modal.Confirm
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="Delete Plan"
                    message={
                        plan.subscriptions_count > 0
                            ? `Cannot delete "${plan.name}" because it has ${plan.subscriptions_count} active subscription(s). Please cancel all subscriptions first.`
                            : `Are you sure you want to delete "${plan.name}"? This action cannot be undone.`
                    }
                    confirmText={plan.subscriptions_count > 0 ? "OK" : "Delete Plan"}
                    cancelText="Cancel"
                    variant="danger"
                    showCancel={plan.subscriptions_count === 0}
                />
            </div>
        </AdminLayout>
    );
};

export default Show;