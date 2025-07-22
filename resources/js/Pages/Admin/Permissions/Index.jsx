import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import DataTable from '@/Components/UI/DataTable';
import ConfirmationModal from '@/Components/UI/ConfirmationModal';
import {
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    KeyIcon,
    ShieldCheckIcon,
    UsersIcon,
    DocumentTextIcon,
    Squares2X2Icon,
    TableCellsIcon,
    LockClosedIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const PermissionCard = ({ permission, onEdit, onDelete }) => {
    const getPermissionIcon = (name) => {
        if (name.includes('user')) return UsersIcon;
        if (name.includes('role')) return ShieldCheckIcon;
        if (name.includes('permission')) return KeyIcon;
        return LockClosedIcon;
    };

    const getPermissionColor = (name) => {
        if (name.includes('create')) return 'from-green-500 to-green-600';
        if (name.includes('edit') || name.includes('update')) return 'from-blue-500 to-blue-600';
        if (name.includes('delete')) return 'from-red-500 to-red-600';
        if (name.includes('view') || name.includes('read')) return 'from-purple-500 to-purple-600';
        return 'from-gray-500 to-gray-600';
    };

    const formatPermissionName = (name) => {
        return name.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getPermissionGroup = (name) => {
        const parts = name.split('.');
        return parts[0] ? parts[0].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'General';
    };

    const IconComponent = getPermissionIcon(permission.name);

    return (
        <Card className="hover:shadow-lg transition-all duration-300 group">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={clsx(
                            'w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br',
                            getPermissionColor(permission.name)
                        )}>
                            <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatPermissionName(permission.name)}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {getPermissionGroup(permission.name)} • {permission.guard_name || 'web'} guard
                            </p>
                        </div>
                    </div>
                    <Badge variant={permission.roles?.length > 0 ? 'success' : 'secondary'}>
                        {permission.roles?.length || 0} roles
                    </Badge>
                </div>

                {/* Roles */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-navy-700 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ShieldCheckIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Assigned Roles
                            </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {permission.roles?.length || 0}
                        </span>
                    </div>
                    {permission.roles && permission.roles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {permission.roles.slice(0, 3).map((role, index) => (
                                <Badge key={index} variant="outline" className="text-xs capitalize">
                                    {role.name}
                                </Badge>
                            ))}
                            {permission.roles.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{permission.roles.length - 3} more
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Timestamps */}
                <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                    Created: {new Date(permission.created_at).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    <Link href={`/admin/permissions/${permission.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View
                        </Button>
                    </Link>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEdit(permission);
                        }}
                        className="flex-1"
                    >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(permission);
                        }}
                        disabled={permission.roles?.length > 0}
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

const PermissionsIndex = ({ permissions, roles, stats }) => {
    const [viewMode, setViewMode] = useState('cards');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleEdit = (permission) => {
        if (!permission || !permission.id) {
            console.error('Invalid permission object:', permission);
            return;
        }
        router.visit(`/admin/permissions/${permission.id}/edit`);
    };

    const handleDelete = (permission) => {
        if (!permission || !permission.id) {
            console.error('Invalid permission object:', permission);
            return;
        }
        setPermissionToDelete(permission);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!permissionToDelete || !permissionToDelete.id) {
            console.error('No permission selected for deletion');
            return;
        }

        setDeleteLoading(true);
        router.delete(`/admin/permissions/${permissionToDelete.id}`, {
            onSuccess: () => {
                setDeleteLoading(false);
                setShowDeleteModal(false);
                setPermissionToDelete(null);
            },
            onError: (errors) => {
                console.error('Delete failed:', errors);
                setDeleteLoading(false);
                // Keep modal open on error so user can try again
            }
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPermissionName = (name) => {
        return name.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getPermissionGroup = (name) => {
        const parts = name.split('.');
        return parts[0] ? parts[0].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'General';
    };

    // DataTable columns
    const tableColumns = [
        {
            key: 'name',
            title: 'Permission',
            accessor: 'name',
            sortable: true,
            filterable: true,
            render: (item) => (
                <div className="flex items-center space-x-3">
                    <div className={clsx(
                        'w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br',
                        item.name.includes('create') ? 'from-green-500 to-green-600' :
                            item.name.includes('edit') || item.name.includes('update') ? 'from-blue-500 to-blue-600' :
                                item.name.includes('delete') ? 'from-red-500 to-red-600' :
                                    'from-purple-500 to-purple-600'
                    )}>
                        <KeyIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                            {formatPermissionName(item.name)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {getPermissionGroup(item.name)} • {item.guard_name || 'web'} guard
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'group',
            title: 'Group',
            accessor: 'name',
            sortable: true,
            filterable: true,
            render: (item) => (
                <Badge variant="outline" className="capitalize">
                    {getPermissionGroup(item.name)}
                </Badge>
            )
        },
        {
            key: 'roles_count',
            title: 'Assigned Roles',
            accessor: 'roles_count',
            sortable: true,
            render: (item) => (
                <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="w-4 h-4 text-gray-400" />
                    <Badge variant={item.roles?.length > 0 ? 'success' : 'secondary'}>
                        {item.roles?.length || 0}
                    </Badge>
                </div>
            )
        },
        {
            key: 'guard_name',
            title: 'Guard',
            accessor: 'guard_name',
            sortable: true,
            render: (item) => (
                <Badge variant="outline">
                    {item.guard_name || 'web'}
                </Badge>
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
                    <Link href={`/admin/permissions/${item.id}`}>
                        <Button variant="outline" size="sm">
                            <EyeIcon className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(item);
                        }}
                    >
                        <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(item);
                        }}
                        disabled={item.roles?.length > 0}
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
            <Link href="/admin/roles">
                <Button variant="outline">
                    <ShieldCheckIcon className="w-4 h-4 mr-2" />
                    Manage Roles
                </Button>
            </Link>
            <Button variant="outline">
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Export Permissions
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
            <KeyIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No permissions found</h3>
            <p className="text-sm mb-6">
                Create your first permission to start defining user capabilities.
            </p>
            <Link href="/admin/permissions/create">
                <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Permission
                </Button>
            </Link>
        </div>
    );

    const breadcrumbs = [
        { label: 'Permission Management', href: null }
    ];

    return (
        <AdminLayout title="Permission Management" breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Permissions</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage system permissions and capabilities
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

                        <Link href="/admin/roles">
                            <Button variant="outline">
                                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                Roles
                            </Button>
                        </Link>
                        <Link href="/admin/permissions/create">
                            <Button className="shadow-lg">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Create Permission
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
                                        <KeyIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center">
                                        <ShieldCheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center">
                                        <UserGroupIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {permissions?.filter(permission => permission.roles?.length > 0).length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Assigned Permissions
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
                                        <LockClosedIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {[...new Set(permissions?.map(p => p.name.split('.')[0]))].length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Permission Groups
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Content - Cards or Table View */}
                {viewMode === 'cards' ? (
                    /* Cards View */
                    permissions && permissions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {permissions.map((permission) => (
                                <PermissionCard
                                    key={permission.id}
                                    permission={permission}
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
                        data={permissions || []}
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
                        onRowClick={(item) => router.visit(`/admin/permissions/${item.id}`)}
                        className="shadow-lg"
                    />
                )}

                {/* Enhanced Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title={permissionToDelete?.roles?.length > 0 ? "Cannot Delete Permission" : "Delete Permission"}
                    message={
                        permissionToDelete?.roles?.length > 0 ? (
                            <div className="space-y-3">
                                <p>Cannot delete "{permissionToDelete?.name}" because it's assigned to {permissionToDelete?.roles?.length} role(s).</p>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        <strong>Required Action:</strong> Please remove this permission from all roles before deleting it.
                                    </p>
                                </div>
                                {permissionToDelete?.roles && permissionToDelete.roles.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned to roles:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {permissionToDelete.roles.map((role, index) => (
                                                <Badge key={index} variant="outline" className="text-xs capitalize">
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p>Are you sure you want to delete the permission "{permissionToDelete?.name}"?</p>
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                    <p className="text-sm text-red-800 dark:text-red-200">
                                        <strong>Warning:</strong> This action cannot be undone and will permanently remove this permission from the system.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                    confirmText={permissionToDelete?.roles?.length > 0 ? "Understood" : "Delete Permission"}
                    cancelText="Cancel"
                    variant={permissionToDelete?.roles?.length > 0 ? "warning" : "danger"}
                    showCancel={permissionToDelete?.roles?.length === 0}
                    loading={deleteLoading}
                    icon={permissionToDelete?.roles?.length > 0 ? ShieldCheckIcon : TrashIcon}
                />
            </div>
        </AdminLayout>
    );
};

export default PermissionsIndex;