import React from 'react';
import { Link } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import { DocumentArrowDownIcon, CalendarIcon } from '@heroicons/react/24/outline';

const InvoiceRow = ({ invoice }) => {
    const getStatusBadge = (status) => {
        const variants = {
            paid: 'success',
            pending: 'warning',
            failed: 'danger',
            draft: 'default',
        };
        return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
    };

    return (
        <tr className="border-b border-gray-200 dark:border-navy-700">
            <td className="py-4 px-6">
                <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900 dark:text-white">{invoice.date}</span>
                </div>
            </td>
            <td className="py-4 px-6">
                <span className="text-sm font-medium text-gray-900 dark:text-white">#{invoice.id}</span>
            </td>
            <td className="py-4 px-6">
                <span className="text-sm font-bold text-gray-900 dark:text-white">${invoice.total}</span>
            </td>
            <td className="py-4 px-6">
                {getStatusBadge(invoice.status)}
            </td>
            <td className="py-4 px-6">
                <a
                    href={invoice.download_url}
                    className="inline-flex items-center text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                    Download
                </a>
            </td>
        </tr>
    );
};

const Invoices = ({ invoices }) => {
    return (
        <ClientLayout title="Invoices">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Billing History</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and download your invoices and payment history
                    </p>
                </div>

                {/* Invoices Table */}
                <Card padding={false}>
                    {invoices.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-navy-800">
                                    <tr>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Invoice
                                        </th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-navy-800 divide-y divide-gray-200 dark:divide-navy-700">
                                    {invoices.map((invoice) => (
                                        <InvoiceRow key={invoice.id} invoice={invoice} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <DocumentArrowDownIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices yet</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Your invoices will appear here once you have an active subscription.
                            </p>
                            <Link href="/client/plans">
                                <Button>View Plans</Button>
                            </Link>
                        </div>
                    )}
                </Card>

                {/* Billing Information */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing Information</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Payment Method</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage your payment methods in the{' '}
                                <Link href="/client/payment-methods" className="text-brand-600 hover:text-brand-700 dark:text-brand-400">
                                    Payment Methods
                                </Link>{' '}
                                section.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Billing Address</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Update your billing address in your{' '}
                                <Link href="/profile" className="text-brand-600 hover:text-brand-700 dark:text-brand-400">
                                    Profile Settings
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </ClientLayout>
    );
};

export default Invoices;