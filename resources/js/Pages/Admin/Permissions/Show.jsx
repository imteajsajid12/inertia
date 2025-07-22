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
    KeyIcon,
    ShieldCheckIcon,
    CalendarIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Show = ({ permission }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDelete = () => {
        setDeleteLoading(true);
        router.delete(`/admin/permissions/${permission.id}`, {
            onSuccess: () => {
                setDeleteLoading(false);
                setShowDeleteModal(false);
            },
            onError: () => {
                setDeleteLoading(false);
            }
        });
    };

    const getPermissionColor = (name) => {
        const colors = {
            'users': 'from-blue-500 to-blue-600',
            'roles': 'from-purple-500 to-purple-600',
            'permissions': 'from-red-500 to-red-600',
            'plans': 'from-green-500 to-green-600',
            'subscriptions': 'from-yellow-500 to-yellow-600',
            'settings': 'from-gray-500 to-gray-600',
        };
        const prefix = name.split('.')[0];
        return colors[prefix] || 'from-indigo-500 to-indigo-600';
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

    const formatPermissionName = (name) => {
        return name.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getPermissionGroup = (name) => {
        return name.split('.')[0].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const breadcrumbs = [
        { label: 'Permission Management', href: '/admin/permissions' },
        { label: permission.name, href: null }
    ];

    return (
        <AdminLayout title={`Permission - ${permission.name}`} breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={clsx(
                            'w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br',
                            getPermissionColor(permission.name)
                        )}>
                            <KeyIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {formatPermissionName(permission.name)}
                            </h1>
                            <div className="flex items-center space-x-3 mt-2">
                                <Badge variant="outline">
                                    {permission.guard_name || 'web'} guard
                                </Badge>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    ID: {permission.id}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link href={`/admin/permissions/${permission.id}/edit`}>
                            <Button variant="outline">
                                <PencilIcon className="w-4 h-4 mr-2" />
                                Edit Permission
                            </Button>
                        </Link>
                        <Button
                            variant="danger"
                            onClick={() => setShowDeleteModal(true)}
                            disabled={permission.roles.length > 0}
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Permission Details */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <KeyIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Permission Details</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                        {permission.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Group</label>
                                    <p className="mt-1 text-gray-900 dark:text-white capitalize">
                                        {getPermissionGroup(permission.name)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Guard</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {permission.guard_name || 'web'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                        <div className="mt-1">
                                            <Badge variant={permission.roles.length > 0 ? 'success' : 'secondary'}>
                                                {permission.roles.length > 0 ? 'In Use' : 'Unused'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {formatDate(permission.created_at)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {formatDate(permission.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Assigned Roles */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-2">
                                    <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Assigned Roles</h2>
                                </div>
                                <Link href="/admin/roles">
                                    <Button variant="outline" size="sm">Manage Roles</Button>
                                </Link>
                            </div>

                            {permission.roles && permission.roles.length > 0 ? (
                                <div className="space-y-3">
                                    {permission.roles.map((role) => (
                                        <div key={role.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-navy-700 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                                    <ShieldCheckIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                                                        {role.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {role.guard_name || 'web'} guard
                                                    </p>
                                                </div>
                                            </div>
                                            <Link href={`/admin/roles/${role.id}`}>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <ShieldCheckIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No Roles Assigned
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        This permission is not assigned to any roles yet.
                                    </p>
                                    <Link href="/admin/roles/create">
                                        <Button>
                                            <PencilIcon className="w-4 h-4 mr-2" />
                                            Assign to Role
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Enhanced Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title={permission.roles.length > 0 ? "Cannot Delete Permission" : "Delete Permission"}
                    message={
                        permission.roles.length > 0 ? (
                            <div className="space-y-3">
                                <p>Cannot delete "{permission.name}" because it's assigned to {permission.roles.length} role(s).</p>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        <strong>Required Action:</strong> Please remove this permission from all roles before deleting it.
                                    </p>
                                </div>
                                <div className="mt-3">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned Roles:</p>
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {permission.roles.map((role) => (
                                            <div key={role.id} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                <ShieldCheckIcon className="w-4 h-4" />
                                                <span className="capitalize">{role.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p>Are you sure you want to delete the permission "{permission.name}"?</p>
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                    <p className="text-sm text-red-800 dark:text-red-200">
                                        <strong>Warning:</strong> This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                    confirmText={permission.roles.length > 0 ? "Understood" : "Delete Permission"}
                    cancelText="Cancel"
                    variant={permission.roles.length > 0 ? "warning" : "danger"}
                    showCancel={permission.roles.length === 0}
                    loading={deleteLoading}
                    icon={permission.roles.length > 0 ? ShieldCheckIcon : TrashIcon}
                />
            </div>
        </AdminLayout>
    );
};

export default Show;