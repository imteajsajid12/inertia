import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import FormInput from '@/Components/Forms/FormInput';
import FormTextarea from '@/Components/Forms/FormTextarea';
import Checkbox from '@/Components/Checkbox';
import {
    ShieldCheckIcon,
    KeyIcon,
    UserGroupIcon,
    CheckIcon,
    XMarkIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const PermissionGroup = ({ group, permissions, selectedPermissions, onPermissionChange }) => {
    const groupPermissions = permissions.filter(p => p.name.startsWith(group));
    const allSelected = groupPermissions.every(p => selectedPermissions.includes(p.id));
    const someSelected = groupPermissions.some(p => selectedPermissions.includes(p.id));

    const handleGroupToggle = () => {
        const groupIds = groupPermissions.map(p => p.id);
        if (allSelected) {
            // Remove all group permissions
            onPermissionChange(selectedPermissions.filter(id => !groupIds.includes(id)));
        } else {
            // Add all group permissions
            const newSelected = [...selectedPermissions];
            groupIds.forEach(id => {
                if (!newSelected.includes(id)) {
                    newSelected.push(id);
                }
            });
            onPermissionChange(newSelected);
        }
    };

    const formatPermissionName = (name) => {
        return name.replace(`${group}.`, '').replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatGroupName = (group) => {
        return group.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <KeyIcon className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatGroupName(group)}
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={handleGroupToggle}
                    className={clsx(
                        'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                        allSelected
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400'
                    )}
                >
                    {allSelected ? (
                        <>
                            <XMarkIcon className="w-4 h-4 mr-1" />
                            Deselect All
                        </>
                    ) : (
                        <>
                            <CheckIcon className="w-4 h-4 mr-1" />
                            Select All
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center">
                        <Checkbox
                            id={`permission-${permission.id}`}
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    onPermissionChange([...selectedPermissions, permission.id]);
                                } else {
                                    onPermissionChange(selectedPermissions.filter(id => id !== permission.id));
                                }
                            }}
                        />
                        <label
                            htmlFor={`permission-${permission.id}`}
                            className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                            {formatPermissionName(permission.name)}
                        </label>
                    </div>
                ))}
            </div>

            {someSelected && !allSelected && (
                <div className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                    {groupPermissions.filter(p => selectedPermissions.includes(p.id)).length} of {groupPermissions.length} selected
                </div>
            )}
        </Card>
    );
};

const EditRole = ({ role, permissions = [] }) => {
    // Initialize selectedPermissions with role permission IDs
    const [selectedPermissions, setSelectedPermissions] = useState(
        role.permissions ? role.permissions.map(p => p.id) : []
    );

    const { data, setData, put, processing, errors } = useForm({
        name: role.name || '',
        description: role.description || '',
        guard_name: role.guard_name || 'web',
        permissions: role.permissions ? role.permissions.map(p => p.id) : []
    });

    useEffect(() => {
        const permissionIds = role.permissions ? role.permissions.map(p => p.id) : [];
        setSelectedPermissions(permissionIds);
        setData('permissions', permissionIds);
    }, [role.permissions]);

    // Update form data when permissions change
    useEffect(() => {
        setData('permissions', selectedPermissions);
    }, [selectedPermissions]);

    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/admin/roles/${role.id}`, {
            onSuccess: () => {
                // Handle success if needed
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
            }
        });
    };

    // Group permissions by prefix
    const permissionGroups = [...new Set(permissions.map(p => p.name.split('.')[0]))];

    const breadcrumbs = [
        { label: 'Role Management', href: '/admin/roles' },
        { label: role.name, href: `/admin/roles/${role.id}` },
        { label: 'Edit', href: null }
    ];

    return (
        <AdminLayout title={`Edit ${role.name}`} breadcrumbs={breadcrumbs}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <ShieldCheckIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Role</h1>
                            <p className="text-gray-600 dark:text-gray-400">Update role details and permissions</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Role Name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    placeholder="e.g., Manager"
                                    required
                                    disabled={['admin', 'user'].includes(role.name.toLowerCase())}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Guard Name
                                    </label>
                                    <select
                                        value={data.guard_name}
                                        onChange={(e) => setData('guard_name', e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:text-white"
                                        disabled={['admin', 'user'].includes(role.name.toLowerCase())}
                                    >
                                        <option value="web">Web</option>
                                        <option value="api">API</option>
                                    </select>
                                    {errors.guard_name && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.guard_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <FormTextarea
                                    label="Description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    error={errors.description}
                                    placeholder="Describe the role and its responsibilities..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Permissions */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <UserGroupIcon className="w-6 h-6 text-gray-400" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Permissions</h2>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                ({selectedPermissions.length} selected)
                            </div>
                        </div>

                        {permissionGroups.length > 0 ? (
                            <div className="space-y-6">
                                {permissionGroups.map((group) => (
                                    <PermissionGroup
                                        key={group}
                                        group={group}
                                        permissions={permissions}
                                        selectedPermissions={selectedPermissions}
                                        onPermissionChange={setSelectedPermissions}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="p-8 text-center">
                                <KeyIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No Permissions Available
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Create permissions first to assign them to roles.
                                </p>
                            </Card>
                        )}
                    </div>

                    {/* System Role Warning */}
                    {['admin', 'user'].includes(role.name.toLowerCase()) && (
                        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                            <div className="p-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            <strong>System Role:</strong> This is a system role. Some fields are protected and cannot be modified.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={processing}
                            className="shadow-lg"
                        >
                            Update Role
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditRole;