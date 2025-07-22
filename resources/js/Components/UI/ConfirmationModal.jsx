import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from '@/Components/UI/Button';
import {
    ExclamationTriangleIcon,
    TrashIcon,
    XMarkIcon,
    CheckCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    loading = false,
    showCancel = true,
    icon: CustomIcon = null,
    children = null
}) => {
    const getVariantStyles = () => {
        const variants = {
            danger: {
                iconBg: 'bg-red-100 dark:bg-red-900/20',
                iconColor: 'text-red-600 dark:text-red-400',
                icon: CustomIcon || TrashIcon,
                confirmButton: 'danger'
            },
            warning: {
                iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
                iconColor: 'text-yellow-600 dark:text-yellow-400',
                icon: CustomIcon || ExclamationTriangleIcon,
                confirmButton: 'warning'
            },
            success: {
                iconBg: 'bg-green-100 dark:bg-green-900/20',
                iconColor: 'text-green-600 dark:text-green-400',
                icon: CustomIcon || CheckCircleIcon,
                confirmButton: 'success'
            },
            info: {
                iconBg: 'bg-blue-100 dark:bg-blue-900/20',
                iconColor: 'text-blue-600 dark:text-blue-400',
                icon: CustomIcon || InformationCircleIcon,
                confirmButton: 'primary'
            }
        };
        return variants[variant] || variants.danger;
    };

    const styles = getVariantStyles();
    const IconComponent = styles.icon;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-navy-800 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-start space-x-4">
                                    {/* Icon */}
                                    <div className={clsx(
                                        'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                                        styles.iconBg
                                    )}>
                                        <IconComponent className={clsx('w-6 h-6', styles.iconColor)} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-2"
                                        >
                                            {title}
                                        </Dialog.Title>

                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            {typeof message === 'string' ? (
                                                <p>{message}</p>
                                            ) : (
                                                message
                                            )}
                                        </div>

                                        {children && (
                                            <div className="mb-4">
                                                {children}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center justify-end space-x-3">
                                            {showCancel && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        onClose();
                                                    }}
                                                    disabled={loading}
                                                >
                                                    {cancelText}
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                variant={styles.confirmButton}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onConfirm();
                                                }}
                                                loading={loading}
                                                className="min-w-[100px]"
                                            >
                                                {confirmText}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ConfirmationModal;