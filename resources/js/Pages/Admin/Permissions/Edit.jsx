import React from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import FormInput from '@/Components/Forms/FormInput';
import {
    KeyIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const EditPermission = ({ permission }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: permission.name || '',
        guard_name: permission.guard_name || 'web'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/permissions/${permission.id}`);
    };

    const formatPermissionName = (name) => {
        return name.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const isSystemPermission = permission.name.startsWith('admin.') ||
        permission.roles.some(role => ['admin', 'superadmin'].includes(role.name));

    const breadcrumbs = [
        { label: 'Permission Management', href: '/admin/permissions' },
        { label: permission.name, href: `/admin/permissions/${permission.id}` },
        { label: 'Edit', href: null }
    ];

    return (
        <AdminLayout title="Edit Permission" breadcrumbs={breadcrumbs}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <KeyIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Permission</h1>
                            <p className="text-gray-600 dark:text-gray-400">Update permission details</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Permission Details</h2>

                            <div className="space-y-6">
                                <FormInput
                                    label="Permission Name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    placeholder="e.g., users.create, posts.edit, settings.view"
                                    required
                                    disabled={isSystemPermission}
                                    helpText="Use dot notation: resource.action (e.g., users.create, posts.edit)"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Guard Name
                                    </label>
                                    <select
                                        value={data.guard_name}
                                        onChange={(e) => setData('guard_name', e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:text-white"
                                        disabled={isSystemPermission}
                                    >
                                        <option value="web">Web</option>
                                        <option value="api">API</option>
                                    </select>
                                    {errors.guard_name && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.guard_name}</p>
                                    )}
                                </div>

                                {/* Preview */}
                                {data.name && (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                                            Preview
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <KeyIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm text-blue-800 dark:text-blue-200">
                                                {formatPermissionName(data.name)}
                                            </span>
                                            <span className="text-xs text-blue-600 dark:text-blue-400">
                                                ({data.guard_name} guard)
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* System Permission Warning */}
                    {isSystemPermission && (
                        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                            <div className="p-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            <strong>System Permission:</strong> This is a system permission. Some fields are protected and cannot be modified.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Assigned Roles */}
                    {permission.roles && permission.roles.length > 0 && (
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Assigned Roles
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {permission.roles.map((role) => (
                                        <div key={role.id} className="px-3 py-1 bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300 rounded-md text-sm capitalize">
                                            {role.name}
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                    To modify role assignments, please edit the respective roles.
                                </p>
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
                            disabled={isSystemPermission}
                        >
                            Update Permission
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditPermission;