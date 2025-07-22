import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    CheckCircleIcon,
    CreditCardIcon,
    ChartBarIcon,
    UsersIcon,
    StarIcon
} from '@heroicons/react/24/outline';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const PricingCard = ({ name, price, period, features, popular = false }) => (
    <div className={`bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg relative ${popular ? 'ring-2 ring-blue-500' : ''}`}>
        {popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <StarIcon className="h-3 w-3 mr-1" />
                    Most Popular
                </span>
            </div>
        )}
        <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
            <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">${price}</span>
                <span className="text-gray-500 dark:text-gray-400">/{period}</span>
            </div>
        </div>
        <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                </li>
            ))}
        </ul>
        <Link href="/register">
            <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                }`}>
                Get Started
            </button>
        </Link>
    </div>
);

export default function Welcome({ auth }) {
    const features = [
        {
            icon: CreditCardIcon,
            title: 'Subscription Management',
            description: 'Flexible subscription plans with multiple payment gateways including Stripe, PayPal, and local options.'
        },
        {
            icon: ChartBarIcon,
            title: 'Analytics Dashboard',
            description: 'Comprehensive analytics with revenue tracking, subscription metrics, and business insights.'
        },
        {
            icon: UsersIcon,
            title: 'User Management',
            description: 'Role-based access control with admin and client dashboards for streamlined user management.'
        }
    ];

    const plans = [
        {
            name: 'Basic',
            price: '9.99',
            period: 'month',
            features: [
                'Up to 25 projects',
                'Priority support',
                '10GB storage',
                'Email notifications',
                'Basic analytics'
            ]
        },
        {
            name: 'Professional',
            price: '29.99',
            period: 'month',
            popular: true,
            features: [
                'Unlimited projects',
                '24/7 priority support',
                '100GB storage',
                'All notification types',
                'Advanced analytics',
                'Team collaboration',
                'API access'
            ]
        },
        {
            name: 'Enterprise',
            price: '99.99',
            period: 'month',
            features: [
                'Unlimited everything',
                'Dedicated support manager',
                'Unlimited storage',
                'Custom integrations',
                'Advanced reporting',
                'Custom branding',
                'SLA guarantee'
            ]
        }
    ];

    return (
        <>
            <Head title="Welcome to SaaS Platform" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                {/* Navigation */}
                <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SaaS Platform</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Modern SaaS Subscription Platform
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                            Complete subscription management system with role-based access, multiple payment gateways,
                            and comprehensive analytics. Built with Laravel, React, and Tailwind CSS.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors">
                                    Start Free Trial
                                </button>
                            </Link>
                            <Link href="#features">
                                <button className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg font-medium text-lg border border-gray-300 transition-colors">
                                    Learn More
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Everything You Need
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Powerful features designed to help you manage subscriptions, users, and grow your business.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Choose the plan that's right for you. Upgrade or downgrade at any time.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {plans.map((plan, index) => (
                                <PricingCard key={index} {...plan} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-blue-600">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of businesses already using our platform to manage their subscriptions.
                        </p>
                        <Link href="/register">
                            <button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg font-medium text-lg transition-colors">
                                Start Your Free Trial
                            </button>
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-4">SaaS Platform</h3>
                            <p className="text-gray-400 mb-4">
                                Modern subscription management made simple.
                            </p>
                            <p className="text-gray-500 text-sm">
                                © 2025 SaaS Platform. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}