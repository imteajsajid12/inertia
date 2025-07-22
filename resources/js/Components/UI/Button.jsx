import React from 'react';
import clsx from 'clsx';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-500 disabled:bg-gray-300',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 dark:bg-navy-700 dark:hover:bg-navy-600 dark:text-white',
        outline: 'border border-brand-500 text-brand-500 hover:bg-brand-50 focus:ring-brand-500 dark:border-brand-400 dark:text-brand-400',
        danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 disabled:bg-gray-300',
        success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 disabled:bg-gray-300',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 disabled:bg-gray-300',
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={clsx(
                baseClasses,
                variants[variant],
                sizes[size],
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;