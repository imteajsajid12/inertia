import React, { forwardRef } from 'react';
import clsx from 'clsx';

const FormTextarea = forwardRef(({
    label,
    error,
    className = '',
    required = false,
    helpText,
    rows = 4,
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

            <textarea
                ref={ref}
                rows={rows}
                className={clsx(
                    'block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-navy-800 dark:border-navy-600 dark:text-white transition-colors duration-200 resize-vertical',
                    error
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-navy-600',
                    className
                )}
                {...props}
            />

            {helpText && !error && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
            )}

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
});

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;