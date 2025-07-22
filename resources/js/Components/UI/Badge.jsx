import React from 'react';
import clsx from 'clsx';

const Badge = ({ children, variant = 'default', size = 'md', className, ...props }) => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';

    const variants = {
        default: 'bg-gray-100 text-gray-800 dark:bg-navy-700 dark:text-gray-300',
        primary: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-300',
        success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span
            className={clsx(
                baseClasses,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;