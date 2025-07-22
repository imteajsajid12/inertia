import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import FormInput from '@/Components/Forms/FormInput';
import {
    KeyIcon,
    LightBulbIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

const PermissionSuggestions = ({ onSelect }) => {
    const suggestions = [
        { group: 'users', actions: ['view', 'create', 'edit', 'delete'] },
        { group: 'roles', actions: ['view', 'create', 'edit', 'delete'] },
        { group: 'permissions', actions: ['view', 'create', 'edit', 'delete'] },
        { group: 'plans', actions: ['view', 'create', 'edit', 'delete'] },
        { group: 'subscriptions', actions: ['view', 'create', 'edit', 'delete', 'cancel', 'resume'] },
        { group: 'settings', actions: ['view', 'edit'] },
        { group: 'reports', actions: ['view', 'export'] },
        { group: 'dashboard', actions: ['view'] },
    ];

    return (
        <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
                <LightBulbIcon className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Permission Suggestions
                </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Click on any suggestion to use it as a starting point:
            </p>
            <div className="space-y-3">
                {suggestions.map((group) => (
                    <div key={group.group}>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white capitalize mb-2">
                            {group.group}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {group.actions.map((action) => (
                                <button
                                    key={`${group.group}.${action}`}
                                    type="button"
                                    onClick={() => onSelect(`${group.group}.${action}`)}
                                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-navy-600 transition-colors"
                                >
                                    {group.group}.{action}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const CreatePermission = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        guard_name: 'web'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/permissions');
    };

    const handleSuggestionSelect = (suggestion) => {
        setData('name', suggestion);
    };

    const formatPermissionName = (name) => {
        return name.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const breadcrumbs = [
        { label: 'Permission Management', href: '/admin/permissions' },
        { label: 'Create Permission', href: null }
    ];

    return (
        <AdminLayout title="Create Permission" breadcrumbs={breadcrumbs}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                            <KeyIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Permission</h1>
                            <p className="text-gray-600 dark:text-gray-400">Define a new permission for access control</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <div>
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
                                            >
                                                <option value="web">Web</option>
                                                <option value="api">API</option>
                                            </select>
                                            {errors.guard_name && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.guard_name}</p>
                                            )}
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Choose the guard this permission applies to
                                            </p>
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
                                    Create Permission
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Suggestions */}
                    <div>
                        <PermissionSuggestions onSelect={handleSuggestionSelect} />

                        {/* Best Practices */}
                        <Card className="p-4 mt-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Best Practices
                                </h3>
                            </div>
                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Use dot notation: <code className="text-xs bg-gray-100 dark:bg-navy-700 px-1 rounded">resource.action</code></p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Keep names descriptive and consistent</p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Group related permissions with the same prefix</p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Use standard actions: view, create, edit, delete</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreatePermission;