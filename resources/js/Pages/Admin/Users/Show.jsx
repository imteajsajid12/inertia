import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import ConfirmationModal from '@/Components/UI/ConfirmationModal';
import {
    PencilIcon,
    TrashIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    GlobeAltIcon,
    UserGroupIcon,
    KeyIcon,
    BanknotesIcon,
    ChartBarIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Show = ({ user, subscriptions = [], activities = [] }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDelete = () => {
        setDeleteLoading(true);
        router.delete(`/admin/users/${user.id}`, {
            onSuccess: () => {
                setDeleteLoading(false);
                setShowDeleteModal(false);
            },
            onError: () => {
                setDeleteLoading(false);
            }
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400',
            inactive: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400',
            pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400',
            suspended: 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
        };
        return colors[status] || colors.active;
    };

    const getSubscriptionBadge = (status) => {
        const variants = {
            active: 'success',
            canceled: 'warning',
            trial: 'info',
            expired: 'danger',
            none: 'secondary',
        };
        return variants[status] || 'secondary';
    };

    const getRoleColor = (role) => {
        const colors = {
            admin: 'from-red-500 to-red-600',
            manager: 'from-purple-500 to-purple-600',
            editor: 'from-blue-500 to-blue-600',
            user: 'from-green-500 to-green-600',
            client: 'from-yellow-500 to-yellow-600',
        };
        return colors[role?.toLowerCase()] || 'from-gray-500 to-gray-600';
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const breadcrumbs = [
        { label: 'User Management', href: '/admin/users' },
        { label: user.name, href: null }
    ];

    return (
        <AdminLayout title={`User - ${user.name}`} breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={clsx(
                            'w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br',
                            getRoleColor(user.roles?.[0]?.name || user.role)
                        )}>
                            <UserIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {user.name}
                            </h1>
                            <div className="flex items-center space-x-3 mt-2">
                                <div className={clsx(
                                    'px-3 py-1 rounded-full text-sm font-medium',
                                    getStatusColor(user.status || 'active')
                                )}>
                                    {user.status || 'Active'}
                                </div>
                                <Badge variant="outline" className="capitalize">
                                    {user.roles?.[0]?.name || user.role || 'User'}
                                </Badge>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    ID: {user.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link href={`/admin/users/${user.id}/edit`}>
                            <Button variant="outline">
                                <PencilIcon className="w-4 h-4 mr-2" />
                                Edit User
                            </Button>
                        </Link>
                        <Button
                            variant="danger"
                            onClick={() => setShowDeleteModal(true)}
                            disabled={user.id === 1} // Prevent deleting admin
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
                                        <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Member Since
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
                                        <CreditCardIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {user.current_plan || 'Free'}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Current Plan
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
                                        <BanknotesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(user.total_spent)}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Spent
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
                                        <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {user.last_login ? formatDate(user.last_login) : 'Never'}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Last Login
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Details */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Details</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                        {user.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                                    <div className="mt-1 flex items-center space-x-2">
                                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                        <p className="text-gray-900 dark:text-white">{user.email}</p>
                                        {user.email_verified_at && (
                                            <CheckCircleIcon className="w-4 h-4 text-green-500" title="Verified" />
                                        )}
                                    </div>
                                </div>

                                {user.phone && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
                                        <div className="mt-1 flex items-center space-x-2">
                                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                                            <p className="text-gray-900 dark:text-white">{user.phone}</p>
                                        </div>
                                    </div>
                                )}

                                {user.address && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                                        <div className="mt-1 flex items-center space-x-2">
                                            <MapPinIcon className="w-4 h-4 text-gray-400" />
                                            <p className="text-gray-900 dark:text-white">{user.address}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {formatDate(user.created_at)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {formatDate(user.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Role & Permissions */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Role & Permissions</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Role</label>
                                    <div className="mt-2">
                                        <Badge variant="outline" className="capitalize text-base px-3 py-2">
                                            <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                            {user.roles?.[0]?.name || user.role || 'User'}
                                        </Badge>
                                    </div>
                                </div>

                                {user.roles?.[0]?.permissions && user.roles[0].permissions.length > 0 && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 block">
                                            Permissions ({user.roles[0].permissions.length})
                                        </label>
                                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                                            {user.roles[0].permissions.map((permission) => (
                                                <div key={permission.id} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-navy-700 rounded-lg">
                                                    <KeyIcon className="w-3 h-3 text-gray-400" />
                                                    <span className="text-sm text-gray-900 dark:text-white">
                                                        {permission.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Subscription History */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <CreditCardIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subscription History</h2>
                            </div>
                            <Badge variant={getSubscriptionBadge(user.subscription_status || 'none')}>
                                {user.subscription_status || 'None'}
                            </Badge>
                        </div>

                        {subscriptions && subscriptions.length > 0 ? (
                            <div className="space-y-4">
                                {subscriptions.map((subscription) => (
                                    <div key={subscription.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-navy-700 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                                <CreditCardIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {subscription.plan_name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(subscription.created_at)} - {subscription.ends_at ? formatDate(subscription.ends_at) : 'Active'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(subscription.amount)}
                                            </p>
                                            <Badge variant={getSubscriptionBadge(subscription.status)}>
                                                {subscription.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CreditCardIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No Subscription History
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    This user hasn't subscribed to any plans yet.
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <ChartBarIcon className="w-5 h-5 text-gray-400" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                        </div>

                        {activities && activities.length > 0 ? (
                            <div className="space-y-4">
                                {activities.slice(0, 10).map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-navy-700 rounded-lg">
                                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <DocumentTextIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 dark:text-white">
                                                {activity.description || activity.action}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(activity.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <ChartBarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No Recent Activity
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    No recent activity to display for this user.
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete User"
                message={
                    <div className="space-y-3">
                        <p>Are you sure you want to delete "{user.name}"?</p>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-sm text-red-800 dark:text-red-200">
                                <strong>Warning:</strong> This action cannot be undone and will permanently remove:
                            </p>
                            <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                                <li>• User account and profile data</li>
                                <li>• All associated subscriptions and plans</li>
                                <li>• User activity history and logs</li>
                            </ul>
                        </div>
                    </div>
                }
                confirmText="Delete User"
                cancelText="Cancel"
                variant="danger"
                loading={deleteLoading}
                icon={TrashIcon}
            />
        </AdminLayout>
    );
};

export default Show;