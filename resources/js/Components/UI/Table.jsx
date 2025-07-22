import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Table = ({
    columns = [],
    data = [],
    sortable = false,
    sortColumn = null,
    sortDirection = 'asc',
    onSort = () => { },
    className = '',
    emptyMessage = 'No data available'
}) => {
    const handleSort = (column) => {
        if (!sortable || !column.sortable) return;

        const newDirection = sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
        onSort(column.key, newDirection);
    };

    const getSortIcon = (column) => {
        if (!sortable || !column.sortable) return null;

        if (sortColumn === column.key) {
            return sortDirection === 'asc'
                ? <ChevronUpIcon className="h-4 w-4" />
                : <ChevronDownIcon className="h-4 w-4" />;
        }

        return <ChevronUpDownIcon className="h-4 w-4 opacity-50" />;
    };

    return (
        <div className={`bg-white dark:bg-navy-800 shadow-14 rounded-2xl overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-navy-700">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={clsx(
                                        'px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                                        sortable && column.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-600'
                                    )}
                                    onClick={() => handleSort(column)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.label}</span>
                                        {getSortIcon(column)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-navy-800 divide-y divide-gray-200 dark:divide-navy-700">
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors duration-150">
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                            {column.render ? column.render(row, rowIndex) : (
                                                <span className="text-sm text-gray-900 dark:text-white">
                                                    {row[column.key]}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <div className="text-gray-500 dark:text-gray-400">
                                        <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-sm">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Pagination component
const Pagination = ({ links, className = '' }) => {
    if (!links || links.length <= 3) return null;

    return (
        <div className={`flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-navy-700 ${className}`}>
            <div className="flex-1 flex justify-between sm:hidden">
                {links.find(link => link.label.includes('Previous')) && (
                    <Link
                        href={links.find(link => link.label.includes('Previous')).url}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-navy-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-navy-800 hover:bg-gray-50 dark:hover:bg-navy-700"
                    >
                        Previous
                    </Link>
                )}
                {links.find(link => link.label.includes('Next')) && (
                    <Link
                        href={links.find(link => link.label.includes('Next')).url}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-navy-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-navy-800 hover:bg-gray-50 dark:hover:bg-navy-700"
                    >
                        Next
                    </Link>
                )}
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {links.map((link, index) => {
                            if (link.label.includes('Previous') || link.label.includes('Next')) {
                                return (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={clsx(
                                            'relative inline-flex items-center px-2 py-2 text-sm font-medium',
                                            index === 0 ? 'rounded-l-md' : '',
                                            index === links.length - 1 ? 'rounded-r-md' : '',
                                            link.url
                                                ? 'text-gray-500 dark:text-gray-400 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 hover:bg-gray-50 dark:hover:bg-navy-700'
                                                : 'text-gray-300 dark:text-gray-600 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 cursor-default'
                                        )}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={clsx(
                                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                        link.active
                                            ? 'z-10 bg-brand-50 dark:bg-brand-900 border-brand-500 text-brand-600 dark:text-brand-400'
                                            : link.url
                                                ? 'bg-white dark:bg-navy-800 border-gray-300 dark:border-navy-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-700'
                                                : 'bg-white dark:bg-navy-800 border-gray-300 dark:border-navy-600 text-gray-300 dark:text-gray-600 cursor-default'
                                    )}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
};

Table.Pagination = Pagination;

export default Table;