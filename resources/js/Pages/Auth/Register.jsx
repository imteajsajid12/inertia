import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    const passwordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const getStrengthColor = (strength) => {
        if (strength < 2) return 'bg-red-500';
        if (strength < 4) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = (strength) => {
        if (strength < 2) return 'Weak';
        if (strength < 4) return 'Medium';
        return 'Strong';
    };

    return (
        <>
            <Head title="Create Account" />
            <div className="min-h-screen bg-gray-50 dark:bg-navy-900 flex">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
                        <div className="max-w-md text-center">
                            <h1 className="text-4xl font-bold mb-6">Join Our Platform</h1>
                            <p className="text-xl text-brand-100 mb-8">
                                Create your account and start managing your subscriptions today
                            </p>
                            <div className="space-y-4 text-brand-100">
                                <div className="flex items-center">
                                    <CheckCircleIcon className="w-5 h-5 text-brand-300 mr-3" />
                                    <span>Free 14-day trial</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircleIcon className="w-5 h-5 text-brand-300 mr-3" />
                                    <span>No credit card required</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircleIcon className="w-5 h-5 text-brand-300 mr-3" />
                                    <span>Cancel anytime</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                {/* Right Side - Register Form */}
                <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Create your account
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:border-navy-600 dark:text-white ${errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-navy-600'
                                        }`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email address
                                </label>
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
                                        autoComplete="new-password"
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`block w-full px-4 py-3 pr-12 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:border-navy-600 dark:text-white ${errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-navy-600'
                                            }`}
                                        placeholder="Create a password"
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

                                {/* Password Strength Indicator */}
                                {data.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex-1 bg-gray-200 dark:bg-navy-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength(data.password))}`}
                                                    style={{ width: `${(passwordStrength(data.password) / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {getStrengthText(passwordStrength(data.password))}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={`block w-full px-4 py-3 pr-12 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:border-navy-600 dark:text-white ${errors.password_confirmation ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-navy-600'
                                            }`}
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Terms Agreement */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        checked={data.terms}
                                        onChange={(e) => setData('terms', e.target.checked)}
                                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded dark:border-navy-600 dark:bg-navy-800"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                                        I agree to the{' '}
                                        <a href="#" className="text-brand-600 hover:text-brand-500 dark:text-brand-400">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="text-brand-600 hover:text-brand-500 dark:text-brand-400">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                            </div>
                            {errors.terms && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.terms}</p>
                            )}

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={processing || !data.terms}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {processing ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating account...
                                        </div>
                                    ) : (
                                        'Create account'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}