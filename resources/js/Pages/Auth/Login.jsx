import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Sign In" />
            <div className="min-h-screen bg-gray-50 dark:bg-navy-900 flex">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
                        <div className="max-w-md text-center">
                            <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
                            <p className="text-xl text-brand-100 mb-8">
                                Sign in to access your dashboard and manage your subscriptions
                            </p>
                            <div className="space-y-4 text-brand-100">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-brand-300 rounded-full mr-3"></div>
                                    <span>Manage your subscriptions</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-brand-300 rounded-full mr-3"></div>
                                    <span>Track your billing history</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-brand-300 rounded-full mr-3"></div>
                                    <span>Access premium features</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Sign in to your account
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Or{' '}
                                <Link
                                    href={route('register')}
                                    className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
                                >
                                    create a new account
                                </Link>
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                <p className="text-sm text-green-600 dark:text-green-400">{status}</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:border-navy-600 dark:text-white ${errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-navy-600'
                                            }`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`block w-full px-4 py-3 pr-12 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:border-navy-600 dark:text-white ${errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-navy-600'
                                            }`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded dark:border-navy-600 dark:bg-navy-800"
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                        Remember me
                                    </label>
                                </div>

                                {canResetPassword && (
                                    <div className="text-sm">
                                        <Link
                                            href={route('password.request')}
                                            className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {processing ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </div>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Demo Credentials:</h4>
                            <div className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
                                <div>Admin: admin@test.com / password</div>
                                <div>Client: client@test.com / password</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}