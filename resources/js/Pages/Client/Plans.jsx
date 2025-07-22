import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import { CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline';

const PlanCard = ({ plan, currentPlan, subscriptionStatus, onSubscribe, onChangePlan }) => {
    const [loading, setLoading] = useState(false);
    const isCurrentPlan = currentPlan?.id === plan.id;
    const isPopular = plan.name.toLowerCase().includes('professional');

    const handleAction = async () => {
        setLoading(true);
        try {
            if (isCurrentPlan) {
                return; // No action for current plan
            } else if (currentPlan) {
                await onChangePlan(plan);
            } else {
                await onSubscribe(plan);
            }
        } finally {
            setLoading(false);
        }
    };

    const getActionButton = () => {
        if (isCurrentPlan) {
            return (
                <Button variant="outline" className="w-full" disabled>
                    Current Plan
                </Button>
            );
        }

        if (subscriptionStatus === 'none' || !currentPlan) {
            return (
                <Button
                    className="w-full"
                    onClick={handleAction}
                    loading={loading}
                >
                    {plan.trial_days > 0 ? `Start ${plan.trial_days}-Day Trial` : 'Subscribe Now'}
                </Button>
            );
        }

        if (plan.can_upgrade) {
            return (
                <Button
                    className="w-full"
                    onClick={handleAction}
                    loading={loading}
                >
                    Upgrade to {plan.name}
                </Button>
            );
        }

        if (plan.can_downgrade) {
            return (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleAction}
                    loading={loading}
                >
                    Downgrade to {plan.name}
                </Button>
            );
        }

        return (
            <Button variant="outline" className="w-full" disabled>
                Not Available
            </Button>
        );
    };

    return (
        <Card className={`p-6 relative ${isCurrentPlan ? 'ring-2 ring-brand-500' : ''} ${isPopular ? 'border-brand-500' : ''}`}>
            {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="primary" className="px-3 py-1">
                        <StarIcon className="h-3 w-3 mr-1" />
                        Most Popular
                    </Badge>
                </div>
            )}

            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>

                <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400">/{plan.billing_cycle}</span>
                </div>

                {plan.trial_days > 0 && (
                    <Badge variant="info" className="mb-4">
                        {plan.trial_days} days free trial
                    </Badge>
                )}

                {isCurrentPlan && (
                    <Badge variant="success" className="mb-4">
                        Current Plan
                    </Badge>
                )}
            </div>

            <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">What's included:</h4>
                <ul className="space-y-3">
                    {plan.features?.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {getActionButton()}
        </Card>
    );
};

const Plans = ({ plans, currentPlan, subscriptionStatus }) => {
    const [billingCycle, setBillingCycle] = useState('monthly');

    const filteredPlans = plans.filter(plan =>
        plan.billing_period === billingCycle || plan.billing_period === 'free'
    );

    const handleSubscribe = async (plan) => {
        // For now, we'll redirect to a payment form
        // In a real implementation, you'd integrate with Stripe Elements
        router.post(`/client/subscribe/${plan.id}`, {
            payment_method: 'pm_card_visa', // This would come from Stripe Elements
        });
    };

    const handleChangePlan = async (plan) => {
        router.patch(`/client/change-plan/${plan.id}`);
    };

    return (
        <ClientLayout title="Subscription Plans">
            <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Select the perfect plan for your needs. Upgrade or downgrade at any time.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center bg-gray-100 dark:bg-navy-700 rounded-lg p-1">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${billingCycle === 'monthly'
                                    ? 'bg-white dark:bg-navy-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${billingCycle === 'yearly'
                                    ? 'bg-white dark:bg-navy-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            Yearly
                            <Badge variant="success" size="sm" className="ml-2">Save 20%</Badge>
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {filteredPlans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            currentPlan={currentPlan}
                            subscriptionStatus={subscriptionStatus}
                            onSubscribe={handleSubscribe}
                            onChangePlan={handleChangePlan}
                        />
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Can I change my plan at any time?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately,
                                    while downgrades take effect at the next billing cycle.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    What happens during the free trial?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    During your free trial, you'll have access to all features of your selected plan.
                                    You won't be charged until the trial period ends.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Can I cancel my subscription?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Yes, you can cancel your subscription at any time. You'll continue to have access
                                    to your plan features until the end of your current billing period.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </ClientLayout>
    );
};

export default Plans;