import React from 'react';
import { Link } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import {
    CreditCardIcon,
    UsersIcon,
    CurrencyDollarIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    ChartBarIcon,
    ArrowRightIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const MetricCard = ({ title, value, change, changeType, icon: Icon, color, href }) => {
    const content = (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
                    {change && (
                        <div className={clsx(
                            'flex items-center mt-2 text-sm',
                            changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        )}>
                            {changeType === 'positive' ? (
                                <TrendingUpIcon className="w-4 h-4 mr-1" />
                            ) : (
                                <TrendingDownIcon className="w-4 h-4 mr-1" />
                            )}
                            {change}
                        </div>
                    )}
                </div>
                <div className={clsx(
                    'w-12 h-12 rounded-2xl flex items-center justify-center',
                    color
                )}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    return href ? (
        <Link href={href}>
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                {content}
            </Card>
        </Link>
    ) : (
        <Card>{content}</Card>
    );
};

const RecentSubscription = ({ subscription }) => {
    const getStatusBadge = (status) => {
        const variants = {
            active: { variant: 'success', icon: CheckCircleIcon },
            trialing: { variant: 'info', icon: ClockIcon },
            canceled: { variant: 'danger', icon: ExclamationTriangleIcon },
            past_due: { variant: 'warning', icon: ExclamationTriangleIcon },
        };

        const config = variants[status] || variants.active;
        const IconComponent = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center">
                <IconComponent className="w-3 h-3 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </Badge>
        );
    };

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-navy-700 rounded-lg">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <CreditCardIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                        {subscription.user?.name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {subscription.plan?.name || 'Unknown Plan'}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {getStatusBadge(subscription.stripe_status)}
                <Link href={`/admin/subscriptions/${subscription.id}`}>
                    <Button variant="outline" size="sm">
                        View
                    </Button>
                </Link>
            </div>
        </div>
    );
};

const SubscriptionMetrics = ({ metrics = {}, recentSubscriptions = [] }) => {
    const defaultMetrics = {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        monthlyRevenue: '0.00',
        churnRate: '0.0',
        ...metrics
    };

    const metricCards = [
        {
            title: 'Total Subscriptions',
            value: defaultMetrics.totalSubscriptions,
            change: '+12% from last month',
            changeType: 'positive',
            icon: UsersIcon,
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            href: '/admin/subscriptions'
        },
        {
            title: 'Active Subscriptions',
            value: defaultMetrics.activeSubscriptions,
            change: '+8% from last month',
            changeType: 'positive',
            icon: CheckCircleIcon,
            color: 'bg-gradient-to-br from-green-500 to-green-600',
            href: '/admin/subscriptions?status=active'
        },
        {
            title: 'Monthly Revenue',
            value: `$${defaultMetrics.monthlyRevenue}`,
            change: '+15% from last month',
            changeType: 'positive',
            icon: CurrencyDollarIcon,
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            href: '/admin/subscriptions/analytics'
        },
        {
            title: 'Churn Rate',
            value: `${defaultMetrics.churnRate}%`,
            change: '-2% from last month',
            changeType: 'positive',
            icon: TrendingDownIcon,
            color: 'bg-gradient-to-br from-orange-500 to-orange-600',
            href: '/admin/subscriptions/analytics'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricCards.map((metric, index) => (
                    <MetricCard key={index} {...metric} />
                ))}
            </div>

            {/* Recent Activity and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Subscriptions */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <CreditCardIcon className="w-5 h-5 text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Recent Subscriptions
                                </h3>
                            </div>
                            <Link href="/admin/subscriptions">
                                <Button variant="outline" size="sm">
                                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                                    View All
                                </Button>
                            </Link>
                        </div>

                        {recentSubscriptions.length > 0 ? (
                            <div className="space-y-3">
                                {recentSubscriptions.slice(0, 5).map((subscription) => (
                                    <RecentSubscription key={subscription.id} subscription={subscription} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <CreditCardIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No recent subscriptions</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <ChartBarIcon className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Quick Actions
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <Link href="/admin/subscriptions/analytics" className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    <ChartBarIcon className="w-4 h-4 mr-3" />
                                    View Analytics Dashboard
                                </Button>
                            </Link>

                            <Link href="/admin/subscriptions/export" className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    <ArrowRightIcon className="w-4 h-4 mr-3" />
                                    Export Subscriptions
                                </Button>
                            </Link>

                            <Link href="/admin/plans" className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    <CreditCardIcon className="w-4 h-4 mr-3" />
                                    Manage Plans
                                </Button>
                            </Link>

                            <Link href="/admin/subscriptions?status=past_due" className="block">
                                <Button variant="outline" className="w-full justify-start text-yellow-600 border-yellow-200 hover:bg-yellow-50">
                                    <ExclamationTriangleIcon className="w-4 h-4 mr-3" />
                                    Review Past Due
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SubscriptionMetrics;