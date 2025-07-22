import React, { forwardRef } from 'react';
import clsx from 'clsx';

const FormInput = forwardRef(({
    label,
    error,
    type = 'text',
    className = '',
    required = false,
    helpText,
    icon: Icon,
    ...props
}, ref) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}

                <input
                    ref={ref}
                    type={type}
                    className={clsx(
                        'block w-full py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:border-navy-600 dark:text-white transition-colors duration-200',
                        Icon ? 'pl-10 pr-4' : 'px-4',
                        error
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-navy-600',
                        className
                    )}
                    {...props}
                />
            </div>

            {helpText && !error && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
            )}

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
});

FormInput.displayName = 'FormInput';

export default FormInput;