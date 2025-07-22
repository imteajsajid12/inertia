import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import DataTable from '@/Components/UI/DataTable';
import Modal from '@/Components/UI/Modal';
import {
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    CreditCardIcon,
    UsersIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    DocumentTextIcon,
    ArrowPathIcon,
    UserIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const SubscriptionsDataTable = ({ subscriptions, stats, filters }) => {
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [subscriptionToCancel, setSubscriptionToCancel] = useState(null);

    const getStatusBadge = (status) => {
        const variants = {
            active: 'success',
            canceled: 'danger',
            past_due: 'warning',
            unpaid: 'danger',
            trialing: 'info',
            incomplete: 'warning',
            incomplete_expired: 'danger',
        };
        return variants[status] || 'secondary';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount, currency = 'USD') => {
        if (!amount) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount / 100);
    };

    const handleCancelSubscription = (subscription) => {
        setSubscriptionToCancel(subscription);
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        if (subscriptionToCancel) {
            router.patch(`/admin/subscriptions/${subscriptionToCancel.id}/cancel`);
            setShowCancelModal(false);
            setSubscriptionToCancel(null);
        }
    };

    const handleResumeSubscription = (subscription) => {
        router.patch(`/admin/subscriptions/${subscription.id}/resume`);
    };

    const columns = [
        {
            key: 'user',
            title: 'Customer',
            accessor: 'user',
            sortable: true,
            filterable: true,
            render: (item) => (
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                            {item.user?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.user?.email}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'plan',
            title: 'Plan',
            accessor: 'plan',
            sortable: true,
            filterable: true,
            render: (item) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                        {item.plan?.name || 'Unknown Plan'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.plan?.billing_period || 'monthly'}
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            title: 'Status',
            accessor: 'stripe_status',
            sortable: true,
            filterable: true,
            type: 'badge',
            getBadgeVariant: getStatusBadge,
            render: (item) => {
                const status = item.stripe_status;
                const variant = getStatusBadge(status);
                const icons = {
                    active: CheckCircleIcon,
                    canceled: XMarkIcon,
                    past_due: ExclamationTriangleIcon,
                    unpaid: ExclamationTriangleIcon,
                    trialing: ClockIcon,
                    incomplete: ClockIcon,
                    incomplete_expired: XMarkIcon,
                };
                const IconComponent = icons[status] || CheckCircleIcon;

                return (
                    <Badge variant={variant} className="flex items-center">
                        <IconComponent className="w-3 h-3 mr-1" />
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </Badge>
                );
            }
        },
        {
            key: 'amount',
            title: 'Amount',
            accessor: 'amount',
            sortable: true,
            render: (item) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.quantity * (item.plan?.price || 0))}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        per {item.plan?.billing_period || 'month'}
                    </div>
                </div>
            )
        },
        {
            key: 'trial_ends_at',
            title: 'Trial Ends',
            accessor: 'trial_ends_at',
            sortable: true,
            render: (item) => {
                if (!item.trial_ends_at) return '-';
                const isActive = new Date(item.trial_ends_at) > new Date();
                return (
                    <div className={clsx(
                        'text-sm',
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                    )}>
                        {formatDate(item.trial_ends_at)}
                        {isActive && (
                            <div className="text-xs text-blue-500">Active</div>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'created_at',
            title: 'Created',
            accessor: 'created_at',
            sortable: true,
            render: (item) => (
                <div className="text-sm text-gray-900 dark:text-white">
                    {formatDate(item.created_at)}
                </div>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            sortable: false,
            render: (item) => (
                <div className="flex items-center space-x-2">
                    <Link href={`/admin/subscriptions/${item.id}`}>
                        <Button variant="outline" size="sm">
                            <EyeIcon className="w-4 h-4" />
                        </Button>
                    </Link>

                    {item.stripe_status === 'active' && !item.ends_at && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelSubscription(item)}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </Button>
                    )}

                    {item.stripe_status === 'canceled' && item.ends_at && new Date(item.ends_at) > new Date() && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResumeSubscription(item)}
                            className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                        >
                            <ArrowPathIcon className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    const tableActions = (
        <>
            <Link href="/admin/subscriptions/analytics">
                <Button variant="outline">
                    <ChartBarIcon className="w-4 h-4 mr-2" />
                    Analytics
                </Button>
            </Link>
            <Link href="/admin/subscriptions/export">
                <Button variant="outline">
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Export
                </Button>
            </Link>
        </>
    );

    const bulkActions = (
        <>
            <Button variant="outline" size="sm">
                <XMarkIcon className="w-4 h-4 mr-1" />
                Cancel Selected
            </Button>
            <Button variant="outline" size="sm">
                <DocumentTextIcon className="w-4 h-4 mr-1" />
                Export Selected
            </Button>
        </>
    );

    const emptyState = (
        <div className="text-gray-500 dark:text-gray-400">
            <CreditCardIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No subscriptions found</h3>
            <p className="text-sm mb-6">
                No subscriptions match your current filters. Try adjusting your search criteria.
            </p>
            <Link href="/admin/plans">
                <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Plans
                </Button>
            </Link>
        </div>
    );

    const breadcrumbs = [
        { label: 'Subscriptions Management', href: null }
    ];

    return (
        <AdminLayout title="Subscriptions Management" breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage and monitor all user subscriptions
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                                        <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats?.total || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Subscriptions
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
                                        <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats?.active || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Active Subscriptions
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
                                        {stats?.trialing || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Trial Subscriptions
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
                                        <CurrencyDollarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ${stats?.monthly_revenue || '0.00'}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Monthly Revenue
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Data Table */}
                <DataTable
                    data={subscriptions || []}
                    columns={columns}
                    searchable={true}
                    sortable={true}
                    filterable={true}
                    pagination={true}
                    pageSize={15}
                    selectable={true}
                    actions={tableActions}
                    bulkActions={bulkActions}
                    emptyState={emptyState}
                    onRowClick={(item) => router.visit(`/admin/subscriptions/${item.id}`)}
                    className="shadow-lg"
                />

                {/* Cancel Confirmation Modal */}
                <Modal.Confirm
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={confirmCancel}
                    title="Cancel Subscription"
                    message={`Are you sure you want to cancel ${subscriptionToCancel?.user?.name}'s subscription? This action will cancel the subscription at the end of the current billing period.`}
                    confirmText="Cancel Subscription"
                    cancelText="Keep Active"
                    variant="danger"
                />
            </div>
        </AdminLayout>
    );
};

export default SubscriptionsDataTable;