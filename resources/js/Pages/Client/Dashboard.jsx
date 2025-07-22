import React from 'react';
import { Link } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import {
    CreditCardIcon,
    CalendarIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const SubscriptionCard = ({ subscription }) => {
    if (!subscription) {
        return (
            <Card className="p-6">
                <div className="text-center">
                    <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Active Subscription</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Choose a plan to get started with our service
                    </p>
                    <Link href="/client/plans">
                        <Button className="mt-4">
                            View Plans
                        </Button>
                    </Link>
                </div>
            </Card>
        );
    }

    const getStatusBadge = (status) => {
        const variants = {
            active: 'success',
            trial: 'info',
            canceled: 'warning',
            past_due: 'danger',
            inactive: 'default',
        };
        return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
    };

    const getStatusIcon = (status) => {
        if (status === 'active' || status === 'trial') {
            return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
        }
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Subscription</h3>
                {getStatusBadge(subscription.status)}
            </div>

            {subscription.plan && (
                <div className="space-y-4">
                    <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{subscription.plan.name}</h4>
                        <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                            {subscription.plan.price}
                            <span className="text-sm font-normal text-gray-500">/{subscription.plan.billing_cycle}</span>
                        </p>
                    </div>

                    {subscription.next_billing_date && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Next billing: {subscription.next_billing_date}
                        </div>
                    )}

                    {subscription.trial_ends_at && (
                        <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Trial ends: {subscription.trial_ends_at}
                        </div>
                    )}

                    {subscription.ends_at && (
                        <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Subscription ends: {subscription.ends_at}
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-200 dark:border-navy-700">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Features</h5>
                        <ul className="space-y-1">
                            {subscription.plan.features?.map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </Card>
    );
};

const PlanCard = ({ plan, isCurrentPlan }) => (
    <Card className={`p-6 ${isCurrentPlan ? 'ring-2 ring-brand-500' : ''}`}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
            {isCurrentPlan && <Badge variant="primary">Current</Badge>}
        </div>

        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {plan.price}
            <span className="text-sm font-normal text-gray-500">/{plan.billing_cycle}</span>
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>

        <ul className="space-y-2 mb-6">
            {plan.features?.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                </li>
            ))}
        </ul>

        {!isCurrentPlan && (
            <Button
                variant={plan.can_upgrade ? 'primary' : 'outline'}
                className="w-full"
                disabled={!plan.can_upgrade && !plan.can_downgrade}
            >
                {plan.can_upgrade ? 'Upgrade' : plan.can_downgrade ? 'Downgrade' : 'Current Plan'}
            </Button>
        )}
    </Card>
);

const Dashboard = ({ subscription, plans }) => {
    return (
        <ClientLayout title="Dashboard">
            <div className="space-y-8">
                {/* Subscription Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <SubscriptionCard subscription={subscription} />
                    </div>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link href="/client/plans">
                                <Button variant="outline" className="w-full">
                                    View All Plans
                                </Button>
                            </Link>
                            <Link href="/client/invoices">
                                <Button variant="outline" className="w-full">
                                    View Invoices
                                </Button>
                            </Link>
                            <Link href="/client/payment-methods">
                                <Button variant="outline" className="w-full">
                                    Payment Methods
                                </Button>
                            </Link>
                            {subscription && subscription.status === 'canceled' && (
                                <form action="/client/resume" method="POST">
                                    <Button variant="success" className="w-full">
                                        Resume Subscription
                                    </Button>
                                </form>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Available Plans */}
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Available Plans</h2>
                        <p className="text-gray-600 dark:text-gray-400">Choose the plan that best fits your needs</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.slice(0, 3).map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isCurrentPlan={plan.is_current}
                            />
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <Link href="/client/plans">
                            <Button variant="outline">
                                View All Plans
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
};

export default Dashboard;