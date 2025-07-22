import React, { useState } from 'react';
import ClientLayout from '@/Layouts/ClientLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import {
    CreditCardIcon,
    PlusIcon,
    TrashIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const PaymentMethodCard = ({ paymentMethod, isDefault, onSetDefault, onDelete }) => {
    const [loading, setLoading] = useState(false);

    const handleSetDefault = async () => {
        setLoading(true);
        try {
            await onSetDefault(paymentMethod.id);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this payment method?')) {
            setLoading(true);
            try {
                await onDelete(paymentMethod.id);
            } finally {
                setLoading(false);
            }
        }
    };

    const getCardBrand = (brand) => {
        const brands = {
            visa: 'Visa',
            mastercard: 'Mastercard',
            amex: 'American Express',
            discover: 'Discover',
        };
        return brands[brand] || brand;
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <CreditCardIcon className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {getCardBrand(paymentMethod.card?.brand)} •••• {paymentMethod.card?.last4}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Expires {paymentMethod.card?.exp_month}/{paymentMethod.card?.exp_year}
                        </p>
                    </div>
                </div>
                {isDefault && (
                    <Badge variant="success">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Default
                    </Badge>
                )}
            </div>

            <div className="flex items-center space-x-2">
                {!isDefault && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSetDefault}
                        loading={loading}
                    >
                        Set as Default
                    </Button>
                )}
                <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    loading={loading}
                    disabled={isDefault}
                >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                </Button>
            </div>
        </Card>
    );
};

const PaymentMethods = ({ paymentMethods, defaultPaymentMethod, intent }) => {
    const [showAddForm, setShowAddForm] = useState(false);

    const handleSetDefault = async (paymentMethodId) => {
        // Implementation would go here
        console.log('Set default:', paymentMethodId);
    };

    const handleDelete = async (paymentMethodId) => {
        // Implementation would go here
        console.log('Delete:', paymentMethodId);
    };

    const handleAddPaymentMethod = () => {
        setShowAddForm(true);
        // Here you would integrate with Stripe Elements
        // For now, we'll just show a placeholder
    };

    return (
        <ClientLayout title="Payment Methods">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Methods</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your payment methods and billing information
                        </p>
                    </div>
                    <Button onClick={handleAddPaymentMethod}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Payment Method
                    </Button>
                </div>

                {/* Payment Methods List */}
                <div className="space-y-4">
                    {paymentMethods.length > 0 ? (
                        paymentMethods.map((paymentMethod) => (
                            <PaymentMethodCard
                                key={paymentMethod.id}
                                paymentMethod={paymentMethod}
                                isDefault={paymentMethod.id === defaultPaymentMethod}
                                onSetDefault={handleSetDefault}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <Card className="p-12 text-center">
                            <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No payment methods
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Add a payment method to manage your subscriptions and billing.
                            </p>
                            <Button onClick={handleAddPaymentMethod}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Your First Payment Method
                            </Button>
                        </Card>
                    )}
                </div>

                {/* Add Payment Method Form */}
                {showAddForm && (
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Add New Payment Method
                            </h3>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <strong>Note:</strong> This is a demo interface. In a production environment,
                                    this would integrate with Stripe Elements for secure payment method collection.
                                </p>
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </Button>
                                <Button disabled>
                                    Add Payment Method (Demo)
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Security Information */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Security & Privacy
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <p>
                                • Your payment information is securely stored and encrypted
                            </p>
                            <p>
                                • We use industry-standard security measures to protect your data
                            </p>
                            <p>
                                • Payment processing is handled by trusted third-party providers
                            </p>
                            <p>
                                • You can remove payment methods at any time
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </ClientLayout>
    );
};

export default PaymentMethods;