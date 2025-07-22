import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FormSelect = forwardRef(({
    label,
    error,
    options = [],
    className = '',
    required = false,
    helpText,
    placeholder = 'Select an option',
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
                <select
                    ref={ref}
                    className={clsx(
                        'block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:border-navy-600 dark:text-white transition-colors duration-200 appearance-none',
                        error
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-navy-600',
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </div>
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

FormSelect.displayName = 'FormSelect';

export default FormSelect;