import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import DataTable from '@/Components/UI/DataTable';
import ConfirmationModal from '@/Components/UI/ConfirmationModal';
import {
    MagnifyingGlassIcon,
    EyeIcon,
    UserPlusIcon,
    FunnelIcon,
    PencilIcon,
    TrashIcon,
    UsersIcon,
    UserIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    Squares2X2Icon,
    TableCellsIcon,
    AdjustmentsHorizontalIcon,
    DocumentArrowDownIcon,
    UserGroupIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

// User Card Component for Cards View
const UserCard = ({ user, roles, onEdit, onDelete, onRoleChange }) => {
    const [selectedRole, setSelectedRole] = useState(user.roles?.[0]?.name || user.role || 'user');
    const [updating, setUpdating] = useState(false);

    const handleRoleChange = async (newRole) => {
        if (newRole === selectedRole) return;

        setUpdating(true);
        try {
            await router.patch(`/admin/users/${user.id}/role`, { role: newRole });
            setSelectedRole(newRole);
            if (onRoleChange) onRoleChange(user.id, newRole);
        } finally {
            setUpdating(false);
        }
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
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-300 group">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={clsx(
                            'w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br',
                            getRoleColor(selectedRole)
                        )}>
                            <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {user.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <EnvelopeIcon className="w-4 h-4 mr-1" />
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <div className={clsx(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getStatusColor(user.status || 'active')
                    )}>
                        {user.status || 'Active'}
                    </div>
                </div>

                {/* User Details */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
                        <select
                            value={selectedRole}
                            onChange={(e) => handleRoleChange(e.target.value)}
                            disabled={updating}
                            className="text-sm border border-gray-300 dark:border-navy-600 rounded-md px-2 py-1 bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                        >
                            {roles?.map((role) => (
                                <option key={role.id || role} value={role.name || role}>
                                    {role.name || role}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Subscription</span>
                        <Badge variant={getSubscriptionBadge(user.subscription_status || 'none')}>
                            {user.subscription_status || 'None'}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Plan</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.current_plan || 'Free'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Joined</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                            {formatDate(user.created_at)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    <Link href={`/admin/users/${user.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(user)}
                        className="flex-1"
                    >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(user)}
                        disabled={user.id === 1} // Prevent deleting admin
                        className="flex-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Delete
                    </Button>
                </div>
            </div>
        </Card>
    );
};

const UsersIndex = ({ users, roles, filters, stats }) => {
    const [viewMode, setViewMode] = useState('table');
    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');
    const [subscriptionFilter, setSubscriptionFilter] = useState(filters?.subscription_status || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Real-time search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                handleFilter();
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleFilter = () => {
        router.get('/admin/users', {
            search,
            role: roleFilter,
            subscription_status: subscriptionFilter,
            status: statusFilter,
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setSearch('');
        setRoleFilter('');
        setSubscriptionFilter('');
        setStatusFilter('');
        router.get('/admin/users');
    };

    const handleEdit = (user) => {
        router.get(`/admin/users/${user.id}/edit`);
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            setDeleteLoading(true);
            router.delete(`/admin/users/${userToDelete.id}`, {
                onSuccess: () => {
                    setDeleteLoading(false);
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                },
                onError: () => {
                    setDeleteLoading(false);
                }
            });
        }
    };

    const handleRoleChange = (userId, newRole) => {
        // Handle role change callback if needed
    };

    const handleExport = () => {
        const params = new URLSearchParams({
            search,
            role: roleFilter,
            status: statusFilter,
            subscription_status: subscriptionFilter,
        });

        window.location.href = `/admin/users-export?${params.toString()}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const variants = {
            active: 'success',
            inactive: 'danger',
            pending: 'warning',
            suspended: 'secondary'
        };
        return variants[status] || 'success';
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

    // DataTable columns
    const tableColumns = [
        {
            key: 'user',
            title: 'User',
            accessor: 'name',
            sortable: true,
            filterable: true,
            render: (item) => (
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <EnvelopeIcon className="w-3 h-3 mr-1" />
                            {item.email}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            title: 'Role',
            accessor: 'role',
            sortable: true,
            filterable: true,
            render: (item) => (
                <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="w-4 h-4 text-gray-400" />
                    <Badge variant="outline" className="capitalize">
                        {item.roles?.[0]?.name || item.role || 'User'}
                    </Badge>
                </div>
            )
        },
        {
            key: 'status',
            title: 'Status',
            accessor: 'status',
            sortable: true,
            render: (item) => (
                <Badge variant={getStatusBadge(item.status || 'active')}>
                    {item.status || 'Active'}
                </Badge>
            )
        },
        {
            key: 'subscription',
            title: 'Subscription',
            accessor: 'subscription_status',
            sortable: true,
            render: (item) => (
                <div className="flex items-center space-x-2">
                    <CreditCardIcon className="w-4 h-4 text-gray-400" />
                    <Badge variant={getSubscriptionBadge(item.subscription_status || 'none')}>
                        {item.subscription_status || 'None'}
                    </Badge>
                </div>
            )
        },
        {
            key: 'plan',
            title: 'Plan',
            accessor: 'current_plan',
            sortable: true,
            render: (item) => (
                <span className="text-sm text-gray-900 dark:text-white">
                    {item.current_plan || 'Free'}
                </span>
            )
        },
        {
            key: 'created_at',
            title: 'Joined',
            accessor: 'created_at',
            sortable: true,
            render: (item) => (
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                        {formatDate(item.created_at)}
                    </span>
                </div>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            sortable: false,
            render: (item) => (
                <div className="flex items-center space-x-2">
                    <Link href={`/admin/users/${item.id}`}>
                        <Button variant="outline" size="sm">
                            <EyeIcon className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                    >
                        <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        disabled={item.id === 1}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    const tableActions = (
        <>
            <Button variant="outline" onClick={handleExport}>
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Export Users
            </Button>
            <Link href="/admin/users/create">
                <Button>
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Add User
                </Button>
            </Link>
        </>
    );

    const bulkActions = (
        <>
            <Button variant="outline" size="sm">
                <TrashIcon className="w-4 h-4 mr-1" />
                Delete Selected
            </Button>
            <Button variant="outline" size="sm">
                <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                Export Selected
            </Button>
        </>
    );

    const emptyState = (
        <div className="text-gray-500 dark:text-gray-400">
            <UsersIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No users found</h3>
            <p className="text-sm mb-6">
                {search || roleFilter || subscriptionFilter || statusFilter
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Create your first user to get started.'
                }
            </p>
            {!search && !roleFilter && !subscriptionFilter && !statusFilter && (
                <Link href="/admin/users/create">
                    <Button>
                        <UserPlusIcon className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </Link>
            )}
        </div>
    );

    const breadcrumbs = [
        { label: 'User Management', href: null }
    ];

    return (
        <AdminLayout title="User Management" breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage user accounts, roles, and permissions
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

                        <Button variant="outline" onClick={handleExport}>
                            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Link href="/admin/users/create">
                            <Button className="shadow-lg">
                                <UserPlusIcon className="h-5 w-5 mr-2" />
                                Add User
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
                                        {users?.total || users?.data?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Users
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
                                        {stats?.active_users || users?.data?.filter(u => u.status === 'active').length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Active Users
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
                                        <CreditCardIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats?.subscribed_users || users?.data?.filter(u => u.subscription_status === 'active').length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Subscribed
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
                                        {stats?.new_users_today || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        New Today
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Advanced Search & Filters */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-400" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Search & Filters</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Search Users
                                </label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by name, email, or ID..."
                                        className="pl-10 w-full border border-gray-300 dark:border-navy-600 rounded-xl px-4 py-3 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Role
                                </label>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => {
                                        setRoleFilter(e.target.value);
                                        setTimeout(handleFilter, 100);
                                    }}
                                    className="w-full border border-gray-300 dark:border-navy-600 rounded-xl px-4 py-3 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                >
                                    <option value="">All Roles</option>
                                    {roles?.map((role) => (
                                        <option key={role.id || role} value={role.name || role}>
                                            {role.name || role}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setTimeout(handleFilter, 100);
                                    }}
                                    className="w-full border border-gray-300 dark:border-navy-600 rounded-xl px-4 py-3 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Subscription
                                </label>
                                <select
                                    value={subscriptionFilter}
                                    onChange={(e) => {
                                        setSubscriptionFilter(e.target.value);
                                        setTimeout(handleFilter, 100);
                                    }}
                                    className="w-full border border-gray-300 dark:border-navy-600 rounded-xl px-4 py-3 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                >
                                    <option value="">All Subscriptions</option>
                                    <option value="active">Active</option>
                                    <option value="trial">Trial</option>
                                    <option value="canceled">Canceled</option>
                                    <option value="expired">Expired</option>
                                    <option value="none">No Subscription</option>
                                </select>
                            </div>
                        </div>

                        {(search || roleFilter || statusFilter || subscriptionFilter) && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {users?.total || users?.data?.length || 0} users found
                                </div>
                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                    <XCircleIcon className="w-4 h-4 mr-1" />
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Content - Cards or Table View */}
                {viewMode === 'cards' ? (
                    /* Cards View */
                    users?.data && users.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {users.data.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    roles={roles}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onRoleChange={handleRoleChange}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center">
                            {emptyState}
                        </Card>
                    )
                ) : (
                    /* Table View */
                    <DataTable
                        data={users?.data || []}
                        columns={tableColumns}
                        searchable={false} // We have custom search
                        sortable={true}
                        filterable={false} // We have custom filters
                        pagination={true}
                        pageSize={15}
                        selectable={true}
                        actions={tableActions}
                        bulkActions={bulkActions}
                        emptyState={emptyState}
                        onRowClick={(item) => router.visit(`/admin/users/${item.id}`)}
                        className="shadow-lg"
                        paginationData={users}
                    />
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="Delete User"
                    message={
                        <div className="space-y-3">
                            <p>Are you sure you want to delete "{userToDelete?.name}"?</p>
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
            </div>
        </AdminLayout>
    );
};

export default UsersIndex;