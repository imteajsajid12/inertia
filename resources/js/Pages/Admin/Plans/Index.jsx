import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import {
    PlusIcon,
    PencilIcon,
    EyeIcon,
    TrashIcon,
    CreditCardIcon,
    UsersIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    SparklesIcon,
    ClockIcon,
    CurrencyDollarIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const PlanCard = ({ plan, onToggle, onDelete }) => {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            await router.patch(`/admin/plans/${plan.id}/toggle`);
        } finally {
            setLoading(false);
        }
    };

    const getBillingCycleBadge = (cycle) => {
        const variants = {
            monthly: { variant: 'primary', icon: CalendarIcon, label: 'Monthly' },
            yearly: { variant: 'success', icon: CalendarIcon, label: 'Yearly' },
            free: { variant: 'info', icon: SparklesIcon, label: 'Free' },
        };
        const config = variants[cycle] || variants.monthly;
        const IconComponent = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center">
                <IconComponent className="w-3 h-3 mr-1" />
                {config.label}
            </Badge>
        );
    };

    const getStatusBadge = (isActive) => (
        <Badge variant={isActive ? 'success' : 'danger'} className="flex items-center">
            {isActive ? (
                <CheckCircleIcon className="w-3 h-3 mr-1" />
            ) : (
                <XCircleIcon className="w-3 h-3 mr-1" />
            )}
            {isActive ? 'Active' : 'Inactive'}
        </Badge>
    );

    return (
        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Popular badge for middle-priced plans */}
            {plan.name.toLowerCase().includes('pro') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge variant="primary" className="px-3 py-1 shadow-lg">
                        <SparklesIcon className="w-3 h-3 mr-1" />
                        Popular
                    </Badge>
                </div>
            )}

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={clsx(
                            'w-12 h-12 rounded-2xl flex items-center justify-center',
                            plan.billing_cycle === 'free'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                                : plan.billing_cycle === 'yearly'
                                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                                    : 'bg-gradient-to-br from-purple-500 to-purple-600'
                        )}>
                            <CreditCardIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{plan.slug}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {getBillingCycleBadge(plan.billing_cycle)}
                        {getStatusBadge(plan.is_active)}
                    </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {plan.price}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            /{plan.billing_cycle}
                        </span>
                    </div>
                    {plan.trial_days > 0 && (
                        <div className="flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {plan.trial_days} days free trial
                        </div>
                    )}
                </div>

                {/* Features */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Features</h4>
                    <div className="space-y-2">
                        {(plan.features || []).slice(0, 4).map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                <span className="truncate">{feature}</span>
                            </div>
                        ))}
                        {(plan.features || []).length > 4 && (
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                                +{plan.features.length - 4} more features
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-6 p-3 bg-gray-50 dark:bg-navy-700 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <UsersIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Subscribers</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {plan.subscriptions_count || 0}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    <Link href={`/admin/plans/${plan.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View
                        </Button>
                    </Link>
                    <Link href={`/admin/plans/${plan.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <PencilIcon className="w-4 h-4 mr-1" />
                            Edit
                        </Button>
                    </Link>
                    <Button
                        variant={plan.is_active ? 'danger' : 'success'}
                        size="sm"
                        onClick={handleToggle}
                        loading={loading}
                        className="flex-1"
                    >
                        {plan.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-brand-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Card>
    );
};

const PlansIndex = ({ plans }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleDelete = (plan) => {
        setSelectedPlan(plan);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedPlan) {
            router.delete(`/admin/plans/${selectedPlan.id}`);
            setShowDeleteModal(false);
            setSelectedPlan(null);
        }
    };

    const stats = {
        totalPlans: plans.length,
        activePlans: plans.filter(p => p.is_active).length,
        totalSubscribers: plans.reduce((sum, plan) => sum + (plan.subscriptions_count || 0), 0),
        averagePrice: plans.length > 0 ? (plans.reduce((sum, plan) => sum + parseFloat(plan.price.replace('$', '')), 0) / plans.length).toFixed(2) : 0,
    };

    const breadcrumbs = [
        { label: 'Plans Management', href: null }
    ];

    return (
        <AdminLayout title="Plans Management" breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscription Plans</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Create and manage your subscription plans and pricing
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link href="/admin/plans-configuration">
                            <Button variant="outline">
                                <Cog6ToothIcon className="h-5 w-5 mr-2" />
                                Configuration
                            </Button>
                        </Link>
                        <Link href="/admin/plans/create">
                            <Button className="shadow-lg">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Create New Plan
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                                        <CreditCardIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.totalPlans}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Plans
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
                                        <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.activePlans}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Active Plans
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
                                        <UsersIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.totalSubscribers}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Subscribers
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl flex items-center justify-center">
                                        <CurrencyDollarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ${stats.averagePrice}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Average Price
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Plans Grid */}
                {plans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                onDelete={() => handleDelete(plan)}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <div className="text-gray-400 dark:text-gray-500">
                            <CreditCardIcon className="mx-auto h-16 w-16 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No plans found</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Get started by creating your first subscription plan. Define pricing, features, and billing cycles to start monetizing your service.
                            </p>
                            <Link href="/admin/plans/create">
                                <Button className="shadow-lg">
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Create Your First Plan
                                </Button>
                            </Link>
                        </div>
                    </Card>
                )}

                {/* Delete Confirmation Modal */}
                <Modal.Confirm
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="Delete Plan"
                    message={`Are you sure you want to delete "${selectedPlan?.name}"? This action cannot be undone.`}
                    confirmText="Delete Plan"
                    cancelText="Cancel"
                    variant="danger"
                />
            </div>
        </AdminLayout>
    );
};

export default PlansIndex;