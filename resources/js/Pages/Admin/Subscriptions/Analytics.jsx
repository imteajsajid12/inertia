import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import {
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CurrencyDollarIcon,
    UsersIcon,
    ArrowLeftIcon,
    ArrowPathIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const MetricCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <Card>
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
                                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                            ) : (
                                <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
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
    </Card>
);

const Analytics = ({ analytics = {}, dateRange = '30d' }) => {
    const [selectedRange, setSelectedRange] = useState(dateRange);

    const metrics = {
        totalRevenue: {
            title: 'Total Revenue',
            value: `$${analytics.total_revenue || '0.00'}`,
            change: '+12.5% from last month',
            changeType: 'positive',
            icon: CurrencyDollarIcon,
            color: 'bg-gradient-to-br from-green-500 to-green-600'
        },
        activeSubscriptions: {
            title: 'Active Subscriptions',
            value: analytics.active_subscriptions || '0',
            change: '+8.2% from last month',
            changeType: 'positive',
            icon: UsersIcon,
            color: 'bg-gradient-to-br from-blue-500 to-blue-600'
        },
        monthlyRecurring: {
            title: 'Monthly Recurring Revenue',
            value: `$${analytics.mrr || '0.00'}`,
            change: '+15.3% from last month',
            changeType: 'positive',
            icon: ArrowTrendingUpIcon,
            color: 'bg-gradient-to-br from-purple-500 to-purple-600'
        },
        churnRate: {
            title: 'Churn Rate',
            value: `${analytics.churn_rate || '0.0'}%`,
            change: '-2.1% from last month',
            changeType: 'positive',
            icon: ArrowTrendingDownIcon,
            color: 'bg-gradient-to-br from-orange-500 to-orange-600'
        }
    };

    const breadcrumbs = [
        { label: 'Subscriptions Management', href: '/admin/subscriptions' },
        { label: 'Analytics', href: null }
    ];

    return (
        <AdminLayout title="Subscription Analytics" breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/admin/subscriptions">
                            <Button variant="outline" size="sm">
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                Back to Subscriptions
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Track subscription performance and revenue metrics
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <select
                            value={selectedRange}
                            onChange={(e) => setSelectedRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-navy-800 dark:text-white"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>
                        <Button variant="outline">
                            <ArrowPathIcon className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Button>
                            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.values(metrics).map((metric, index) => (
                        <MetricCard key={index} {...metric} />
                    ))}
                </div>

                {/* Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Revenue Over Time</h3>
                            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-navy-700 rounded-xl">
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                    <ChartBarIcon className="w-12 h-12 mx-auto mb-2" />
                                    <p>Revenue chart would be displayed here</p>
                                    <p className="text-sm">Integration with charting library needed</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Subscription Growth</h3>
                            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-navy-700 rounded-xl">
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                    <ArrowTrendingUpIcon className="w-12 h-12 mx-auto mb-2" />
                                    <p>Growth chart would be displayed here</p>
                                    <p className="text-sm">Integration with charting library needed</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Summary Stats */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Summary Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {analytics.lifetime_value || '$1,250'}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Average Customer Lifetime Value</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                    {analytics.avg_subscription_length || '8.5'}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Average Subscription Length (months)</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                    {analytics.trial_conversion || '68.2'}%
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Trial to Paid Conversion Rate</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Analytics;