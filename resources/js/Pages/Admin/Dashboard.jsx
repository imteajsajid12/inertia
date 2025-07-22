import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import {
    UsersIcon,
    CreditCardIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    EyeIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import Chart from 'react-apexcharts';

const StatCard = ({ title, value, icon: Icon, change, changeType, subtitle }) => (
    <Card className="relative overflow-hidden">
        <div className="p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-2 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl">
                            <Icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                        {subtitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
                        )}
                    </div>

                    {change && (
                        <div className="flex items-center mt-3">
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${changeType === 'increase'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                }`}>
                                {changeType === 'increase' ? (
                                    <ArrowUpIcon className="h-3 w-3" />
                                ) : (
                                    <ArrowDownIcon className="h-3 w-3" />
                                )}
                                <span>{change}%</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-500/10 to-brand-600/10 rounded-full -translate-y-10 translate-x-10"></div>
    </Card>
);

const Dashboard = ({ stats, recentUsers, recentSubscriptions, chartData }) => {
    const chartOptions = {
        chart: {
            type: 'area',
            height: 400,
            toolbar: { show: false },
            background: 'transparent',
            fontFamily: 'Inter, sans-serif',
        },
        theme: {
            mode: 'light',
        },
        colors: ['#3B82F6'],
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            },
        },
        xaxis: {
            categories: chartData?.labels || [],
            labels: {
                style: {
                    colors: '#64748B',
                    fontSize: '12px',
                    fontWeight: 500,
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#64748B',
                    fontSize: '12px',
                    fontWeight: 500,
                },
                formatter: (value) => `$${value}`,
            },
        },
        grid: {
            borderColor: '#E2E8F0',
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        tooltip: {
            y: {
                formatter: (value) => `$${value}`,
            },
            style: {
                fontSize: '12px',
            },
        },
    };

    const chartSeries = [{
        name: 'Revenue',
        data: chartData?.data || [4000, 3000, 5000, 4500, 6000, 5500, 7000, 6500, 8000, 7500, 9000, 8500],
    }];

    return (
        <AdminLayout title="Dashboard">
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h1>
                            <p className="text-brand-100">Here's what's happening with your business today.</p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                                <ChartBarIcon className="w-12 h-12 text-white/80" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <StatCard
                        title="Total Users"
                        value={stats.total_users || '1,234'}
                        subtitle="Registered users"
                        icon={UsersIcon}
                        change={12}
                        changeType="increase"
                    />
                    <StatCard
                        title="Active Subscriptions"
                        value={stats.active_subscriptions || '856'}
                        subtitle="Currently active"
                        icon={CreditCardIcon}
                        change={8}
                        changeType="increase"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value={`$${stats.mrr || '12,450'}`}
                        subtitle="This month"
                        icon={CurrencyDollarIcon}
                        change={15}
                        changeType="increase"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.total_revenue || '89,320'}`}
                        subtitle="All time"
                        icon={ChartBarIcon}
                        change={23}
                        changeType="increase"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Revenue Chart */}
                    <Card className="xl:col-span-2">
                        <div className="p-6 border-b border-gray-100 dark:border-navy-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Overview</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monthly revenue trends and growth</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                        This Year
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <Chart
                                options={chartOptions}
                                series={chartSeries}
                                type="area"
                                height={400}
                            />
                        </div>
                    </Card>

                    {/* Recent Activity */}
                    <div className="space-y-6">
                        {/* Recent Users */}
                        <Card>
                            <div className="p-6 border-b border-gray-100 dark:border-navy-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h3>
                                    <Button variant="outline" size="sm">
                                        <EyeIcon className="h-4 w-4 mr-1" />
                                        View All
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {(recentUsers || [
                                        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'client', created_at: '2 min ago' },
                                        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'client', created_at: '1 hour ago' },
                                        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'client', created_at: '3 hours ago' },
                                    ]).slice(0, 5).map((user) => (
                                        <div key={user.id} className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-semibold text-white">
                                                    {user.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant={user.role === 'admin' ? 'primary' : 'default'} size="sm">
                                                    {user.role}
                                                </Badge>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {user.created_at}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <div className="p-6 border-b border-gray-100 dark:border-navy-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        Create New Plan
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <UsersIcon className="h-4 w-4 mr-2" />
                                        Manage Users
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <ChartBarIcon className="h-4 w-4 mr-2" />
                                        View Analytics
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Recent Subscriptions */}
                <Card>
                    <div className="p-6 border-b border-gray-100 dark:border-navy-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Subscriptions</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest subscription activities</p>
                            </div>
                            <Button variant="outline">
                                View All Subscriptions
                            </Button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {(recentSubscriptions || [
                                { user_name: 'Alice Cooper', user_email: 'alice@example.com', status: 'active', created_at: '5 min ago' },
                                { user_name: 'Bob Wilson', user_email: 'bob@example.com', status: 'trialing', created_at: '1 hour ago' },
                                { user_name: 'Carol Davis', user_email: 'carol@example.com', status: 'active', created_at: '2 hours ago' },
                                { user_name: 'David Brown', user_email: 'david@example.com', status: 'canceled', created_at: '4 hours ago' },
                            ]).map((subscription, index) => (
                                <div key={index} className="p-4 bg-gray-50 dark:bg-navy-700 rounded-xl">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                                            <span className="text-xs font-semibold text-white">
                                                {subscription.user_name.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {subscription.user_name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {subscription.user_email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant={
                                                subscription.status === 'active' ? 'success' :
                                                    subscription.status === 'canceled' ? 'danger' :
                                                        subscription.status === 'trialing' ? 'info' : 'default'
                                            }
                                            size="sm"
                                        >
                                            {subscription.status}
                                        </Badge>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {subscription.created_at}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;