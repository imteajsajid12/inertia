import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, padding = true, ...props }) => {
    return (
        <div
            className={clsx(
                'bg-white dark:bg-navy-800 shadow-14 rounded-[20px] border border-gray-200 dark:border-navy-700',
                padding && 'p-6',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;