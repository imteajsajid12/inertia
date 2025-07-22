import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import FormInput from '@/Components/Forms/FormInput';
import FormTextarea from '@/Components/Forms/FormTextarea';
import FormSelect from '@/Components/Forms/FormSelect';
import Checkbox from '@/Components/Checkbox';
import { PlusIcon, MinusIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const EditPlan = ({ plan }) => {
    const [features, setFeatures] = useState(plan.features || ['']);

    const { data, setData, put, processing, errors } = useForm({
        name: plan.name || '',
        slug: plan.slug || '',
        description: plan.description || '',
        price: plan.price || '',
        billing_period: plan.billing_period || 'monthly',
        trial_days: plan.trial_days || 0,
        features: plan.features || [''],
        is_active: plan.is_active || false,
        is_popular: plan.is_popular || false,
        max_users: plan.max_users || null,
        max_projects: plan.max_projects || null,
        storage_limit: plan.storage_limit || null,
    });

    useEffect(() => {
        setFeatures(plan.features && plan.features.length > 0 ? plan.features : ['']);
    }, [plan.features]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            ...data,
            features: features.filter(feature => feature.trim() !== '')
        };
        put(`/admin/plans/${plan.id}`, formData);
    };

    const addFeature = () => {
        const newFeatures = [...features, ''];
        setFeatures(newFeatures);
        setData('features', newFeatures);
    };

    const removeFeature = (index) => {
        const newFeatures = features.filter((_, i) => i !== index);
        setFeatures(newFeatures);
        setData('features', newFeatures);
    };

    const updateFeature = (index, value) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
        setData('features', newFeatures);
    };

    const generateSlug = (name) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setData('name', name);
        // Only auto-generate slug if it matches the current pattern
        if (!data.slug || data.slug === generateSlug(data.name)) {
            setData('slug', generateSlug(name));
        }
    };

    const breadcrumbs = [
        { label: 'Plans Management', href: '/admin/plans' },
        { label: plan.name, href: `/admin/plans/${plan.id}` },
        { label: 'Edit', href: null }
    ];

    return (
        <AdminLayout title={`Edit ${plan.name}`} breadcrumbs={breadcrumbs}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <CreditCardIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Plan</h1>
                            <p className="text-gray-600 dark:text-gray-400">Update plan details, pricing and features</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Plan Name"
                                    value={data.name}
                                    onChange={handleNameChange}
                                    error={errors.name}
                                    placeholder="e.g., Basic Plan"
                                    required
                                />

                                <FormInput
                                    label="Slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    error={errors.slug}
                                    placeholder="e.g., basic-plan"
                                    required
                                />
                            </div>

                            <div className="mt-6">
                                <FormTextarea
                                    label="Description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    error={errors.description}
                                    placeholder="Describe what this plan offers..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Pricing</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormInput
                                    label="Price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    error={errors.price}
                                    placeholder="0.00"
                                    required
                                />

                                <FormSelect
                                    label="Billing Period"
                                    value={data.billing_period}
                                    onChange={(e) => setData('billing_period', e.target.value)}
                                    error={errors.billing_period}
                                    options={[
                                        { value: 'free', label: 'Free' },
                                        { value: 'monthly', label: 'Monthly' },
                                        { value: 'yearly', label: 'Yearly' },
                                    ]}
                                />

                                <FormInput
                                    label="Trial Days"
                                    type="number"
                                    value={data.trial_days}
                                    onChange={(e) => setData('trial_days', e.target.value)}
                                    error={errors.trial_days}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Features */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Features</h2>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addFeature}
                                >
                                    <PlusIcon className="w-4 h-4 mr-1" />
                                    Add Feature
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <div className="flex-1">
                                            <FormInput
                                                value={feature}
                                                onChange={(e) => updateFeature(index, e.target.value)}
                                                placeholder="Enter feature description"
                                            />
                                        </div>
                                        {features.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeFeature(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <MinusIcon className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Limits */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Limits</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormInput
                                    label="Max Users"
                                    type="number"
                                    value={data.max_users || ''}
                                    onChange={(e) => setData('max_users', e.target.value || null)}
                                    error={errors.max_users}
                                    placeholder="Unlimited"
                                />

                                <FormInput
                                    label="Max Projects"
                                    type="number"
                                    value={data.max_projects || ''}
                                    onChange={(e) => setData('max_projects', e.target.value || null)}
                                    error={errors.max_projects}
                                    placeholder="Unlimited"
                                />

                                <FormInput
                                    label="Storage Limit (GB)"
                                    type="number"
                                    value={data.storage_limit || ''}
                                    onChange={(e) => setData('storage_limit', e.target.value || null)}
                                    error={errors.storage_limit}
                                    placeholder="Unlimited"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Settings */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Settings</h2>

                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                    />
                                    <div className="ml-3">
                                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Active
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Make this plan available for subscription
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Checkbox
                                        id="is_popular"
                                        checked={data.is_popular}
                                        onChange={(e) => setData('is_popular', e.target.checked)}
                                    />
                                    <div className="ml-3">
                                        <label htmlFor="is_popular" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Popular
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Mark this plan as popular (recommended)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Subscription Info */}
                    {plan.subscriptions_count > 0 && (
                        <Card>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Subscription Information</h2>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        <strong>Warning:</strong> This plan has {plan.subscriptions_count} active subscription(s).
                                        Changes to pricing or features may affect existing subscribers.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={processing}
                            className="shadow-lg"
                        >
                            Update Plan
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditPlan;