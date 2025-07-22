import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    footer,
    className = ''
}) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        '2xl': 'max-w-6xl',
    };

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
                    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
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
                            <Dialog.Panel className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white dark:bg-navy-800 p-6 text-left align-middle shadow-xl transition-all ${className}`}>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-semibold leading-6 text-gray-900 dark:text-white"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    {showCloseButton && (
                                        <button
                                            type="button"
                                            className="rounded-lg p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                            onClick={onClose}
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="mb-6">
                                    {children}
                                </div>

                                {/* Footer */}
                                {footer && (
                                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-navy-700">
                                        {footer}
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

// Convenience components for common modal patterns
Modal.Confirm = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        size="sm"
        footer={
            <>
                <Button variant="outline" onClick={onClose}>
                    {cancelText}
                </Button>
                <Button variant={variant} onClick={onConfirm}>
                    {confirmText}
                </Button>
            </>
        }
    >
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </Modal>
);

export default Modal;