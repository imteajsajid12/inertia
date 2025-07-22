import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import DataTable from '@/Components/UI/DataTable';
import Modal from '@/Components/UI/Modal';
import ConfirmationModal from '@/Components/UI/ConfirmationModal';
import {
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ShieldCheckIcon,
    UsersIcon,
    KeyIcon,
    Cog6ToothIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XMarkIcon,
    UserGroupIcon,
    LockClosedIcon,
    DocumentTextIcon,
    Squares2X2Icon,
    TableCellsIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const RoleCard = ({ role, onEdit, onDelete }) => {
    const getPermissionCount = (permissions) => {
        return Array.isArray(permissions) ? permissions.length : 0;
    };

    const getRoleColor = (name) => {
        const colors = {
            admin: 'from-red-500 to-red-600',
            manager: 'from-purple-500 to-purple-600',
            editor: 'from-blue-500 to-blue-600',
            user: 'from-green-500 to-green-600',
            client: 'from-yellow-500 to-yellow-600',
        };
        return colors[name.toLowerCase()] || 'from-gray-500 to-gray-600';
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-300 group">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={clsx(
                            'w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br',
                            getRoleColor(role.name)
                        )}>
                            <ShieldCheckIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                {role.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {role.guard_name || 'web'} guard
                            </p>
                        </div>
                    </div>
                    <Badge variant={role.users_count > 0 ? 'success' : 'secondary'}>
                        {role.users_count || 0} users
                    </Badge>
                </div>

                {/* Description */}
                {role.description && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {role.description}
                        </p>
                    </div>
                )}

                {/* Permissions */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-navy-700 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <KeyIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Permissions
                            </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {getPermissionCount(role.permissions)}
                        </span>
                    </div>
                    {role.permissions && role.permissions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {role.permissions.slice(0, 3).map((permission, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {permission.name}
                                </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{role.permissions.length - 3} more
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Timestamps */}
                <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                    Created: {new Date(role.created_at).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    <Link href={`/admin/roles/${role.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(role)}
                        className="flex-1"
                    >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(role)}
                        disabled={role.users_count > 0 || ['admin', 'user'].includes(role.name.toLowerCase())}
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

const RolesIndex = ({ roles, permissions, stats }) => {
    const [viewMode, setViewMode] = useState('cards');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleEdit = (role) => {
        router.get(`/admin/roles/${role.id}/edit`);
    };

    const handleDelete = (role) => {
        setRoleToDelete(role);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (roleToDelete) {
            setDeleteLoading(true);
            router.delete(`/admin/roles/${roleToDelete.id}`, {
                onSuccess: () => {
                    setDeleteLoading(false);
                    setShowDeleteModal(false);
                    setRoleToDelete(null);
                },
                onError: () => {
                    setDeleteLoading(false);
                }
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // DataTable columns
    const tableColumns = [
        {
            key: 'name',
            title: 'Role',
            accessor: 'name',
            sortable: true,
            filterable: true,
            render: (item) => (
                <div className="flex items-center space-x-3">
                    <div className={clsx(
                        'w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br',
                        item.name.toLowerCase() === 'admin' ? 'from-red-500 to-red-600' :
                            item.name.toLowerCase() === 'manager' ? 'from-purple-500 to-purple-600' :
                                item.name.toLowerCase() === 'editor' ? 'from-blue-500 to-blue-600' :
                                    'from-green-500 to-green-600'
                    )}>
                        <ShieldCheckIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white capitalize">
                            {item.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.guard_name || 'web'} guard
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'description',
            title: 'Description',
            accessor: 'description',
            sortable: true,
            filterable: true,
            render: (item) => (
                <div className="text-sm text-gray-900 dark:text-white">
                    {item.description || 'No description'}
                </div>
            )
        },
        {
            key: 'permissions_count',
            title: 'Permissions',
            accessor: 'permissions_count',
            sortable: true,
            render: (item) => (
                <div className="flex items-center space-x-2">
                    <KeyIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                        {Array.isArray(item.permissions) ? item.permissions.length : 0}
                    </span>
                </div>
            )
        },
        {
            key: 'users_count',
            title: 'Users',
            accessor: 'users_count',
            sortable: true,
            render: (item) => (
                <div className="flex items-center space-x-2">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <Badge variant={item.users_count > 0 ? 'success' : 'secondary'}>
                        {item.users_count || 0}
                    </Badge>
                </div>
            )
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
                    <Link href={`/admin/roles/${item.id}`}>
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
                        disabled={item.users_count > 0 || ['admin', 'user'].includes(item.name.toLowerCase())}
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
            <Link href="/admin/permissions">
                <Button variant="outline">
                    <KeyIcon className="w-4 h-4 mr-2" />
                    Manage Permissions
                </Button>
            </Link>
            <Button variant="outline">
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Export Roles
            </Button>
        </>
    );

    const bulkActions = (
        <>
            <Button variant="outline" size="sm">
                <TrashIcon className="w-4 h-4 mr-1" />
                Delete Selected
            </Button>
            <Button variant="outline" size="sm">
                <DocumentTextIcon className="w-4 h-4 mr-1" />
                Export Selected
            </Button>
        </>
    );

    const emptyState = (
        <div className="text-gray-500 dark:text-gray-400">
            <ShieldCheckIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No roles found</h3>
            <p className="text-sm mb-6">
                Create your first role to start managing user permissions.
            </p>
            <Link href="/admin/roles/create">
                <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Role
                </Button>
            </Link>
        </div>
    );

    const breadcrumbs = [
        { label: 'Role Management', href: null }
    ];

    return (
        <AdminLayout title="Role Management" breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage user roles and their permissions
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

                        <Link href="/admin/permissions">
                            <Button variant="outline">
                                <KeyIcon className="w-4 h-4 mr-2" />
                                Permissions
                            </Button>
                        </Link>
                        <Link href="/admin/roles/create">
                            <Button className="shadow-lg">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Create Role
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
                                        <ShieldCheckIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {roles?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Roles
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
                                        <KeyIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {permissions?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Permissions
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
                                        <UsersIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats?.total_users || 0}
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
                                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl flex items-center justify-center">
                                        <UserGroupIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {roles?.filter(role => role.users_count > 0).length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Active Roles
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Content - Cards or Table View */}
                {viewMode === 'cards' ? (
                    /* Cards View */
                    roles && roles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {roles.map((role) => (
                                <RoleCard
                                    key={role.id}
                                    role={role}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
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
                        data={roles || []}
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
                        onRowClick={(item) => router.visit(`/admin/roles/${item.id}`)}
                        className="shadow-lg"
                    />
                )}

                {/* Enhanced Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title={roleToDelete?.users_count > 0 ? "Cannot Delete Role" : "Delete Role"}
                    message={
                        roleToDelete?.users_count > 0 ? (
                            <div className="space-y-3">
                                <p>Cannot delete "{roleToDelete?.name}" because it has {roleToDelete?.users_count} user(s) assigned.</p>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        <strong>Required Action:</strong> Please reassign all users to different roles before deleting this role.
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                    <UsersIcon className="w-4 h-4" />
                                    <span>Go to Users page to reassign roles</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p>Are you sure you want to delete the role "{roleToDelete?.name}"?</p>
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                    <p className="text-sm text-red-800 dark:text-red-200">
                                        <strong>Warning:</strong> This action cannot be undone and will permanently remove:
                                    </p>
                                    <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                                        <li>• The role and all its settings</li>
                                        <li>• All {roleToDelete?.permissions?.length || 0} assigned permissions</li>
                                        <li>• Any future assignments to this role</li>
                                    </ul>
                                </div>
                            </div>
                        )
                    }
                    confirmText={roleToDelete?.users_count > 0 ? "Understood" : "Delete Role"}
                    cancelText="Cancel"
                    variant={roleToDelete?.users_count > 0 ? "warning" : "danger"}
                    showCancel={roleToDelete?.users_count === 0}
                    loading={deleteLoading}
                    icon={roleToDelete?.users_count > 0 ? UsersIcon : TrashIcon}
                />
            </div>
        </AdminLayout>
    );
};

export default RolesIndex;