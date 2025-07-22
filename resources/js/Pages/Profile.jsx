import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { UserIcon, CameraIcon, KeyIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';
import ClientLayout from '@/Layouts/ClientLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import FormInput from '@/Components/Forms/FormInput';

const Profile = ({ auth, mustVerifyEmail, status }) => {
    const user = auth.user;
    const isAdmin = user.roles?.some(role => role.name === 'admin');
    const Layout = isAdmin ? AdminLayout : ClientLayout;

    // Profile form
    const { data: profileData, setData: setProfileData, patch: updateProfile, errors: profileErrors, processing: profileProcessing } = useForm({
        name: user.name,
        email: user.email,
    });

    // Password form
    const { data: passwordData, setData: setPasswordData, put: updatePassword, errors: passwordErrors, processing: passwordProcessing, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [profilePicture, setProfilePicture] = useState(null);

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        updateProfile(route('profile.update'));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        updatePassword(route('password.update'), {
            onSuccess: () => resetPassword(),
        });
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(URL.createObjectURL(file));
        }
    };

    const breadcrumbs = [
        { label: 'Profile', href: null }
    ];

    return (
        <Layout title="Profile Settings" breadcrumbs={breadcrumbs}>
            <Head title="Profile" />

            <div className="space-y-8">
                {/* Profile Information */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center space-x-6 mb-8">
                            <div className="relative">
                                <div className="w-24 h-24 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center overflow-hidden">
                                    {profilePicture ? (
                                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="w-12 h-12 text-brand-600 dark:text-brand-400" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-white dark:bg-navy-800 rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
                                    <CameraIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                                <div className="mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                                        {isAdmin ? 'Administrator' : 'Client'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Full Name"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData('name', e.target.value)}
                                    error={profileErrors.name}
                                    required
                                />

                                <FormInput
                                    label="Email Address"
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData('email', e.target.value)}
                                    error={profileErrors.email}
                                    required
                                />
                            </div>

                            {mustVerifyEmail && user.email_verified_at === null && (
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Your email address is unverified. Please check your email for a verification link.
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-navy-700">
                                <div>
                                    {status === 'profile-updated' && (
                                        <p className="text-sm text-green-600 dark:text-green-400">Profile updated successfully.</p>
                                    )}
                                </div>
                                <Button type="submit" loading={profileProcessing}>
                                    Update Profile
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>

                {/* Security Settings */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                <KeyIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Security Settings
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Update your password to keep your account secure
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <FormInput
                                label="Current Password"
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                                error={passwordErrors.current_password}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="New Password"
                                    type="password"
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                    error={passwordErrors.password}
                                    required
                                />

                                <FormInput
                                    label="Confirm New Password"
                                    type="password"
                                    value={passwordData.password_confirmation}
                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                    error={passwordErrors.password_confirmation}
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-navy-700">
                                <div>
                                    {status === 'password-updated' && (
                                        <p className="text-sm text-green-600 dark:text-green-400">Password updated successfully.</p>
                                    )}
                                </div>
                                <Button type="submit" variant="danger" loading={passwordProcessing}>
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>

                {/* Account Settings */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Account Settings
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-navy-700 rounded-xl">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates about your account</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-navy-700 rounded-xl">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive emails about new features and updates</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-navy-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-red-900 dark:text-red-400">Delete Account</h4>
                                    <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data</p>
                                </div>
                                <Button variant="danger" size="sm">
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Profile;