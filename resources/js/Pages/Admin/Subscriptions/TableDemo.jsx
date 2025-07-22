import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/UI/DataTable';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    UserIcon,
    CheckCircleIcon,
    XMarkIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

const TableDemo = () => {
    // Sample data for demonstration
    const sampleSubscriptions = [
        {
            id: 1,
            user: { name: 'John Doe', email: 'john@example.com' },
            plan: { name: 'Pro Plan', billing_period: 'monthly', price: 2999 },
            stripe_status: 'active',
            quantity: 1,
            trial_ends_at: null,
            created_at: '2024-01-15T10:30:00Z',
            ends_at: null
        },
        {
            id: 2,
            user: { name: 'Jane Smith', email: 'jane@example.com' },
            plan: { name: 'Basic Plan', billing_period: 'monthly', price: 999 },
            stripe_status: 'trialing',
            quantity: 1,
            trial_ends_at: '2024-02-15T10:30:00Z',
            created_at: '2024-01-10T10:30:00Z',
            ends_at: null
        },
        {
            id: 3,
            user: { name: 'Mike Johnson', email: 'mike@example.com' },
            plan: { name: 'Enterprise Plan', billing_period: 'yearly', price: 29999 },
            stripe_status: 'canceled',
            quantity: 1,
            trial_ends_at: null,
            created_at: '2024-01-05T10:30:00Z',
            ends_at: '2024-02-05T10:30:00Z'
        },
        {
            id: 4,
            user: { name: 'Sarah Wilson', email: 'sarah@example.com' },
            plan: { name: 'Pro Plan', billing_period: 'monthly', price: 2999 },
            stripe_status: 'past_due',
            quantity: 1,
            trial_ends_at: null,
            created_at: '2024-01-01T10:30:00Z',
            ends_at: null
        }
    ];

    const getStatusBadge = (status) => {
        const variants = {
            active: 'success',
            canceled: 'danger',
            past_due: 'warning',
            unpaid: 'danger',
            trialing: 'info',
            incomplete: 'warning',
            incomplete_expired: 'danger',
        };
        return variants[status] || 'secondary';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount, currency = 'USD') => {
        if (!amount) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount / 100);
    };

    const columns = [
        {
            key: 'user',
            title: 'Customer',
            accessor: 'user',
            sortable: true,
            filterable: true,
            render: (item) => (
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                            {item.user?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.user?.email}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'plan',
            title: 'Plan',
            accessor: 'plan',
            sortable: true,
            filterable: true,
            render: (item) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                        {item.plan?.name || 'Unknown Plan'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.plan?.billing_period || 'monthly'}
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            title: 'Status',
            accessor: 'stripe_status',
            sortable: true,
            filterable: true,
            render: (item) => {
                const status = item.stripe_status;
                const variant = getStatusBadge(status);
                const icons = {
                    active: CheckCircleIcon,
                    canceled: XMarkIcon,
                    past_due: ExclamationTriangleIcon,
                    unpaid: ExclamationTriangleIcon,
                    trialing: ClockIcon,
                    incomplete: ClockIcon,
                    incomplete_expired: XMarkIcon,
                };
                const IconComponent = icons[status] || CheckCircleIcon;

                return (
                    <Badge variant={variant} className="flex items-center">
                        <IconComponent className="w-3 h-3 mr-1" />
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </Badge>
                );
            }
        },
        {
            key: 'amount',
            title: 'Amount',
            accessor: 'amount',
            sortable: true,
            render: (item) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.quantity * (item.plan?.price || 0))}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        per {item.plan?.billing_period || 'month'}
                    </div>
                </div>
            )
        },
        {
            key: 'trial_ends_at',
            title: 'Trial Ends',
            accessor: 'trial_ends_at',
            sortable: true,
            render: (item) => {
                if (!item.trial_ends_at) return '-';
                const isActive = new Date(item.trial_ends_at) > new Date();
                return (
                    <div className={`text-sm ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {formatDate(item.trial_ends_at)}
                        {isActive && (
                            <div className="text-xs text-blue-500">Active</div>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'created_at',
            title: 'Created',
            accessor: 'created_at',
            sortable: true,
            render: (item) => (
                <div className="text-sm text-gray-900 dark:text-white">
                    {formatDate(item.created_at)}
                </div>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            sortable: false,
            render: (item) => (
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <EyeIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                        <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    const tableActions = (
        <>
            <Button variant="outline">
                <ChartBarIcon className="w-4 h-4 mr-2" />
                Analytics
            </Button>
            <Button variant="outline">
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Export
            </Button>
        </>
    );

    const bulkActions = (
        <>
            <Button variant="outline" size="sm">
                Cancel Selected
            </Button>
            <Button variant="outline" size="sm">
                Export Selected
            </Button>
        </>
    );

    const breadcrumbs = [
        { label: 'Subscriptions', href: '/admin/subscriptions' },
        { label: 'Table Demo', href: null }
    ];

    return (
        <AdminLayout title="DataTable Demo" breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DataTable Demo</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Demonstration of the advanced DataTable component with subscriptions data
                    </p>
                </div>

                <DataTable
                    data={sampleSubscriptions}
                    columns={columns}
                    searchable={true}
                    sortable={true}
                    filterable={true}
                    pagination={true}
                    pageSize={10}
                    selectable={true}
                    actions={tableActions}
                    bulkActions={bulkActions}
                    onRowClick={(item) => console.log('Row clicked:', item)}
                    className="shadow-lg"
                />
            </div>
        </AdminLayout>
    );
};

export default TableDemo;