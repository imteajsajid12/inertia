import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import FormInput from '@/Components/Forms/FormInput';
import FormTextarea from '@/Components/Forms/FormTextarea';
import Badge from '@/Components/UI/Badge';
import {
    UserIcon,
    ShieldCheckIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    KeyIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const EditUser = ({ user, roles = [], permissions = [] }) => {
    const [selectedRole, setSelectedRole] = useState(user.roles?.[0]?.id || '');
    const [selectedPermissions, setSelectedPermissions] = useState(
        user.permissions ? user.permissions.map(p => p.id) : []
    );

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        status: user.status || 'active',
        role_id: user.roles?.[0]?.id || '',
        permissions: user.permissions ? user.permissions.map(p => p.id) : [],
        password: '',
        password_confirmation: '',
        send_welcome_email: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            ...data,
            role_id: selectedRole,
            permissions: selectedPermissions
        };

        put(`/admin/users/${user.id}`, {
            data: formData,
            onSuccess: () => {
                // Handle success if needed
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
            }
        });
    };

    const handleRoleChange = (roleId) => {
        setSelectedRole(roleId);
        setData('role_id', roleId);

        // Auto-select role permissions
        const role = roles.find(r => r.id == roleId);
        if (role && role.permissions) {
            const rolePermissionIds = role.permissions.map(p => p.id);
            setSelectedPermissions(rolePermissionIds);
            setData('permissions', rolePermissionIds);
        }
    };

    const handlePermissionChange = (permissionId, checked) => {
        let newPermissions;
        if (checked) {
            newPermissions = [...selectedPermissions, permissionId];
        } else {
            newPermissions = selectedPermissions.filter(id => id !== permissionId);
        }
        setSelectedPermissions(newPermissions);
        setData('permissions', newPermissions);
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
        return name.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatGroupName = (group) => {
        return group.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const permissionGroups = groupPermissions(permissions);

    const breadcrumbs = [
        { label: 'User Management', href: '/admin/users' },
        { label: user.name, href: `/admin/users/${user.id}` },
        { label: 'Edit', href: null }
    ];

    return (
        <AdminLayout title={`Edit User - ${user.name}`} breadcrumbs={breadcrumbs}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit User</h1>
                            <p className="text-gray-600 dark:text-gray-400">Update user information and permissions</p>
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
                                    label="Full Name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    placeholder="Enter full name"
                                    required
                                    icon={UserIcon}
                                />

                                <FormInput
                                    label="Email Address"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                    placeholder="Enter email address"
                                    required
                                    icon={EnvelopeIcon}
                                />

                                <FormInput
                                    label="Phone Number"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    error={errors.phone}
                                    placeholder="Enter phone number"
                                    icon={PhoneIcon}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="block w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:text-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="pending">Pending</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <FormInput
                                    label="Address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    error={errors.address}
                                    placeholder="Enter full address"
                                    icon={MapPinIcon}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Password Update */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Password Update</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Leave password fields empty to keep the current password.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="New Password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    placeholder="Enter new password"
                                />

                                <FormInput
                                    label="Confirm Password"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    error={errors.password_confirmation}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.send_welcome_email}
                                        onChange={(e) => setData('send_welcome_email', e.target.checked)}
                                        className="rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50"
                                    />
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                        Send password reset email to user
                                    </span>
                                </label>
                            </div>
                        </div>
                    </Card>

                    {/* Role & Permissions */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Role & Permissions</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    User Role
                                </label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => handleRoleChange(e.target.value)}
                                    className="block w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:text-white"
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name} ({role.permissions?.length || 0} permissions)
                                        </option>
                                    ))}
                                </select>
                                {errors.role_id && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role_id}</p>
                                )}
                            </div>

                            {/* Current Role Info */}
                            {selectedRole && (
                                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <ShieldCheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                            Selected Role: {roles.find(r => r.id == selectedRole)?.name}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        This role includes {roles.find(r => r.id == selectedRole)?.permissions?.length || 0} permissions.
                                        You can customize permissions below.
                                    </p>
                                </div>
                            )}

                            {/* Custom Permissions */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Custom Permissions
                                    </h3>
                                    <Badge variant="outline">
                                        {selectedPermissions.length} selected
                                    </Badge>
                                </div>

                                {Object.keys(permissionGroups).length > 0 ? (
                                    <div className="space-y-6">
                                        {Object.entries(permissionGroups).map(([group, groupPermissions]) => (
                                            <div key={group} className="border border-gray-200 dark:border-navy-600 rounded-lg p-4">
                                                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 capitalize">
                                                    {formatGroupName(group)}
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {groupPermissions.map((permission) => (
                                                        <label key={permission.id} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedPermissions.includes(permission.id)}
                                                                onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                                className="rounded border-gray-300 text-brand-600 shadow-sm focus:border-brand-300 focus:ring focus:ring-brand-200 focus:ring-opacity-50"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                                {formatPermissionName(permission.name)}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border border-gray-200 dark:border-navy-600 rounded-lg">
                                        <KeyIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            No Permissions Available
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Create permissions first to assign them to users.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Admin User Warning */}
                    {user.id === 1 && (
                        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                            <div className="p-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            <strong>Admin User:</strong> This is the primary admin user. Be careful when modifying permissions or status.
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
                            Update User
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditUser;