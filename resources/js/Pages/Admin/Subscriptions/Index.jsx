import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import DataTable from '@/Components/UI/DataTable';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    EyeIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    CreditCardIcon,
    UsersIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    ArrowPathIcon,
    DocumentTextIcon,
    ChartBarIcon,
    Squares2X2Icon,
    TableCellsIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const SubscriptionCard = ({ subscription, onCancel, onResume }) => {
    const [loading, setLoading] = useState(false);

    const getStatusBadge = (status) => {
        const variants = {
            active: { variant: 'success', icon: CheckCircleIcon, label: 'Active' },
            canceled: { variant: 'danger', icon: XMarkIcon, label: 'Canceled' },
            past_due: { variant: 'warning', icon: ExclamationTriangleIcon, label: 'Past Due' },
            unpaid: { variant: 'danger', icon: ExclamationTriangleIcon, label: 'Unpaid' },
            trialing: { variant: 'info', icon: ClockIcon, label: 'Trial' },
            incomplete: { variant: 'warning', icon: ClockIcon, label: 'Incomplete' },
            incomplete_expired: { variant: 'danger', icon: XMarkIcon, label: 'Expired' },
        };

        const config = variants[status] || variants.active;
        const IconComponent = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center">
                <IconComponent className="w-3 h-3 mr-1" />
                {config.label}
            </Badge>
        );
    };

    const handleAction = async (action) => {
        setLoading(true);
        try {
            if (action === 'cancel') {
                await onCancel(subscription);
            } else if (action === 'resume') {
                await onResume(subscription);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount / 100);
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-300">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                            <CreditCardIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {subscription.user?.name || 'Unknown User'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {subscription.user?.email}
                            </p>
                        </div>
                    </div>
                    {getStatusBadge(subscription.stripe_status)}
                </div>

                {/* Plan Info */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-navy-700 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {subscription.plan?.name || 'Unknown Plan'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {subscription.stripe_price}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {formatCurrency(subscription.quantity * (subscription.plan?.price || 0))}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                per {subscription.plan?.billing_period || 'month'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Started</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {formatDate(subscription.created_at)}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">
                            {subscription.ends_at ? 'Ends' : 'Renews'}
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {formatDate(subscription.ends_at || subscription.current_period_end)}
                        </p>
                    </div>
                </div>

                {/* Trial Info */}
                {subscription.trial_ends_at && new Date(subscription.trial_ends_at) > new Date() && (
                    <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center text-blue-800 dark:text-blue-200">
                            <ClockIcon className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                                Trial ends {formatDate(subscription.trial_ends_at)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    <Link href={`/admin/subscriptions/${subscription.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View Details
                        </Button>
                    </Link>

                    {subscription.stripe_status === 'active' && !subscription.ends_at && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleAction('cancel')}
                            loading={loading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    )}

                    {subscription.stripe_status === 'canceled' && subscription.ends_at && new Date(subscription.ends_at) > new Date() && (
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleAction('resume')}
                            loading={loading}
                            className="flex-1"
                        >
                            Resume
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};

const SubscriptionsIndex = ({ subscriptions, stats, filters }) => {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [subscriptionToCancel, setSubscriptionToCancel] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/subscriptions', {
            search: searchTerm,
            status: statusFilter !== 'all' ? statusFilter : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCancel = async (subscription) => {
        if (confirm(`Are you sure you want to cancel ${subscription.user?.name}'s subscription?`)) {
            router.patch(`/admin/subscriptions/${subscription.id}/cancel`);
        }
    };

    const handleResume = async (subscription) => {
        router.patch(`/admin/subscriptions/${subscription.id}/resume`);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        router.get('/admin/subscriptions');
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

    // DataTable columns configuration
    const tableColumns = [
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
                {searchTerm || statusFilter !== 'all'
                    ? 'No subscriptions match your current filters. Try adjusting your search criteria.'
                    : 'No subscriptions have been created yet. Users will appear here once they subscribe to plans.'
                }
            </p>
            {(searchTerm || statusFilter !== 'all') && (
                <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                </Button>
            )}
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
                    <div className="flex items-center space-x-3">
                        {/* View Toggle */}
                        <div className="flex items-center bg-gray-100 dark:bg-navy-700 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('cards')}
                                className={clsx(
                                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                    viewMode === 'cards'
                                        ? 'bg-white dark:bg-navy-600 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                )}
                            >
                                <Squares2X2Icon className="w-4 h-4 mr-1.5" />
                                Cards
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={clsx(
                                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                    viewMode === 'table'
                                        ? 'bg-white dark:bg-navy-600 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                )}
                            >
                                <TableCellsIcon className="w-4 h-4 mr-1.5" />
                                Table
                            </button>
                        </div>

                        <Link href="/admin/subscriptions/analytics">
                            <Button variant="outline">
                                <ChartBarIcon className="h-5 w-5 mr-2" />
                                Analytics
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FunnelIcon className="h-5 w-5 mr-2" />
                            Filters
                        </Button>
                        <Link href="/admin/subscriptions/export">
                            <Button variant="outline">
                                <DocumentTextIcon className="h-5 w-5 mr-2" />
                                Export
                            </Button>
                        </Link>
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

                {/* Filters */}
                {showFilters && (
                    <Card>
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Search
                                        </label>
                                        <div className="relative">
                                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search by user name or email..."
                                                className="pl-10 block w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="block w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:text-white"
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="active">Active</option>
                                            <option value="trialing">Trialing</option>
                                            <option value="canceled">Canceled</option>
                                            <option value="past_due">Past Due</option>
                                            <option value="unpaid">Unpaid</option>
                                        </select>
                                    </div>

                                    <div className="flex items-end space-x-2">
                                        <Button type="submit" className="flex-1">
                                            Apply Filters
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={clearFilters}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Card>
                )}

                {/* Content - Cards or Table View */}
                {viewMode === 'cards' ? (
                    /* Cards View */
                    subscriptions && subscriptions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {subscriptions.map((subscription) => (
                                <SubscriptionCard
                                    key={subscription.id}
                                    subscription={subscription}
                                    onCancel={handleCancel}
                                    onResume={handleResume}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center">
                            <div className="text-gray-400 dark:text-gray-500">
                                <CreditCardIcon className="mx-auto h-16 w-16 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No subscriptions found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                    {searchTerm || statusFilter !== 'all'
                                        ? 'No subscriptions match your current filters. Try adjusting your search criteria.'
                                        : 'No subscriptions have been created yet. Users will appear here once they subscribe to plans.'
                                    }
                                </p>
                                {(searchTerm || statusFilter !== 'all') && (
                                    <Button onClick={clearFilters} variant="outline">
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </Card>
                    )
                ) : (
                    /* Table View */
                    <DataTable
                        data={subscriptions || []}
                        columns={tableColumns}
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
                )}

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

export default SubscriptionsIndex;