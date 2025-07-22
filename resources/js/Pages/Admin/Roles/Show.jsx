import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import ConfirmationModal from '@/Components/UI/ConfirmationModal';
import {
    PencilIcon,
    TrashIcon,
    ShieldCheckIcon,
    UsersIcon,
    KeyIcon,
    CalendarIcon,
    UserIcon,
    CheckCircleIcon,
    XMarkIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Show = ({ role, users = [] }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDelete = () => {
        setDeleteLoading(true);
        router.delete(`/admin/roles/${role.id}`, {
            onSuccess: () => {
                setDeleteLoading(false);
                setShowDeleteModal(false);
            },
            onError: () => {
                setDeleteLoading(false);
            }
        });
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const groupPermissions = (permissions) => {
        const groups = {};
        permissions.forEach(permission => {
            const group = permission.name.split('.')[0];
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(permission);
        });
        return groups;
    };

    const formatPermissionName = (name) => {
        const parts = name.split('.');
        return parts[parts.length - 1].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatGroupName = (group) => {
        return group.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const permissionGroups = role.permissions ? groupPermissions(role.permissions) : {};

    const breadcrumbs = [
        { label: 'Role Management', href: '/admin/roles' },
        { label: role.name, href: null }
    ];

    return (
        <AdminLayout title={`Role - ${role.name}`} breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={clsx(
                            'w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br',
                            getRoleColor(role.name)
                        )}>
                            <ShieldCheckIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                                {role.name} Role
                            </h1>
                            <div className="flex items-center space-x-3 mt-2">
                                <Badge variant="outline">
                                    {role.guard_name || 'web'} guard
                                </Badge>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    ID: {role.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link href={`/admin/roles/${role.id}/edit`}>
                            <Button variant="outline">
                                <PencilIcon className="w-4 h-4 mr-2" />
                                Edit Role
                            </Button>
                        </Link>
                        <Button
                            variant="danger"
                            onClick={() => setShowDeleteModal(true)}
                            disabled={role.users_count > 0 || ['admin', 'user'].includes(role.name.toLowerCase())}
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                        {role.users_count || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Assigned Users
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
                                        {role.permissions?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Permissions
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
                                        <CalendarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {new Date(role.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Created Date
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Role Details */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Role Details</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                        {role.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {role.description || 'No description provided'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Guard</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {role.guard_name || 'web'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                        <div className="mt-1">
                                            <Badge variant={role.users_count > 0 ? 'success' : 'secondary'}>
                                                {role.users_count > 0 ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {formatDate(role.created_at)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {formatDate(role.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Assigned Users */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-2">
                                    <UsersIcon className="w-5 h-5 text-gray-400" />
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Assigned Users</h2>
                                </div>
                                <Link href={`/admin/users?role=${role.id}`}>
                                    <Button variant="outline" size="sm">View All</Button>
                                </Link>
                            </div>

                            {users && users.length > 0 ? (
                                <div className="space-y-3">
                                    {users.slice(0, 5).map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-navy-700 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                                    <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link href={`/admin/users/${user.id}`}>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                    No users assigned to this role
                                </p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Permissions */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <KeyIcon className="w-5 h-5 text-gray-400" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Permissions</h2>
                            <Badge variant="outline">
                                {role.permissions?.length || 0} total
                            </Badge>
                        </div>

                        {Object.keys(permissionGroups).length > 0 ? (
                            <div className="space-y-6">
                                {Object.entries(permissionGroups).map(([group, permissions]) => (
                                    <div key={group}>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 capitalize">
                                            {formatGroupName(group)}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {permissions.map((permission) => (
                                                <div key={permission.id} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-navy-700 rounded-lg">
                                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm text-gray-900 dark:text-white">
                                                        {formatPermissionName(permission.name)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <KeyIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No Permissions Assigned
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    This role doesn't have any permissions assigned yet.
                                </p>
                                <Link href={`/admin/roles/${role.id}/edit`}>
                                    <Button>
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Edit Permissions
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
                title={role.users_count > 0 ? "Cannot Delete Role" : "Delete Role"}
                message={
                    role.users_count > 0 ? (
                        <div className="space-y-3">
                            <p>Cannot delete "{role.name}" because it has {role.users_count} user(s) assigned.</p>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    <strong>Required Action:</strong> Please reassign all users to different roles before deleting this role.
                                </p>
                            </div>
                            {users.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned Users:</p>
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {users.slice(0, 5).map((user) => (
                                            <div key={user.id} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                <UserIcon className="w-4 h-4" />
                                                <span>{user.name} ({user.email})</span>
                                            </div>
                                        ))}
                                        {users.length > 5 && (
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                +{users.length - 5} more users
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p>Are you sure you want to delete the role "{role.name}"?</p>
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <p className="text-sm text-red-800 dark:text-red-200">
                                    <strong>Warning:</strong> This action cannot be undone and will permanently remove:
                                </p>
                                <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                                    <li>• The role and all its settings</li>
                                    <li>• All {role.permissions?.length || 0} assigned permissions</li>
                                    <li>• Any future assignments to this role</li>
                                </ul>
                            </div>
                        </div>
                    )
                }
                confirmText={role.users_count > 0 ? "Understood" : "Delete Role"}
                cancelText="Cancel"
                variant={role.users_count > 0 ? "warning" : "danger"}
                showCancel={role.users_count === 0}
                loading={deleteLoading}
                icon={role.users_count > 0 ? UsersIcon : TrashIcon}
            />
        </AdminLayout>
    );
};

export default Show;