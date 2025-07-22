import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const Breadcrumb = ({ items = [] }) => {
    return (
        <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-brand-600 dark:text-gray-400 dark:hover:text-white"
                    >
                        <HomeIcon className="w-4 h-4 mr-2" />
                        Dashboard
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="ml-1 text-sm font-medium text-gray-700 hover:text-brand-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                                    {item.label}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;