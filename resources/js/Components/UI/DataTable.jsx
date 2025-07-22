import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import {
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowsUpDownIcon,
    EllipsisVerticalIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const DataTable = ({
    data = [],
    columns = [],
    searchable = true,
    sortable = true,
    filterable = false,
    pagination = true,
    pageSize = 10,
    loading = false,
    emptyState = null,
    actions = null,
    bulkActions = null,
    className = '',
    onRowClick = null,
    selectable = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({});

    // Filter and search data
    const filteredData = useMemo(() => {
        let filtered = [...data];

        // Apply search
        if (searchTerm && searchable) {
            filtered = filtered.filter(item =>
                columns.some(column => {
                    const value = column.accessor ? item[column.accessor] : '';
                    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
                })
            );
        }

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                filtered = filtered.filter(item => {
                    const itemValue = item[key];
                    return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
                });
            }
        });

        return filtered;
    }, [data, searchTerm, filters, columns, searchable]);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortConfig.key || !sortable) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig, sortable]);

    // Paginate data
    const paginatedData = useMemo(() => {
        if (!pagination) return sortedData;

        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize, pagination]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

    const handleSort = (key) => {
        if (!sortable) return;

        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleSelectAll = () => {
        if (selectedRows.size === paginatedData.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(paginatedData.map((_, index) => index)));
        }
    };

    const handleSelectRow = (index) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedRows(newSelected);
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />;
        }
        return sortConfig.direction === 'asc'
            ? <ChevronUpIcon className="w-4 h-4 text-blue-600" />
            : <ChevronDownIcon className="w-4 h-4 text-blue-600" />;
    };

    const renderCell = (item, column, rowIndex) => {
        if (column.render) {
            return column.render(item, rowIndex);
        }

        const value = column.accessor ? item[column.accessor] : '';

        if (column.type === 'badge') {
            return (
                <Badge variant={column.getBadgeVariant ? column.getBadgeVariant(value) : 'secondary'}>
                    {value}
                </Badge>
            );
        }

        if (column.type === 'link') {
            return (
                <Link
                    href={column.getHref ? column.getHref(item) : '#'}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    {value}
                </Link>
            );
        }

        if (column.type === 'date') {
            return new Date(value).toLocaleDateString();
        }

        if (column.type === 'currency') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        }

        return value;
    };

    if (loading) {
        return (
            <div className={clsx('bg-white dark:bg-navy-800 rounded-xl shadow-sm border border-gray-200 dark:border-navy-600', className)}>
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={clsx('bg-white dark:bg-navy-800 rounded-xl shadow-sm border border-gray-200 dark:border-navy-600', className)}>
            {/* Header with Search and Actions */}
            {(searchable || filterable || actions || bulkActions) && (
                <div className="p-6 border-b border-gray-200 dark:border-navy-600">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {searchable && (
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                                    />
                                </div>
                            )}

                            {filterable && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <FunnelIcon className="w-4 h-4 mr-2" />
                                    Filters
                                </Button>
                            )}

                            {bulkActions && selectedRows.size > 0 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedRows.size} selected
                                    </span>
                                    {bulkActions}
                                </div>
                            )}
                        </div>

                        {actions && (
                            <div className="flex items-center space-x-2">
                                {actions}
                            </div>
                        )}
                    </div>

                    {/* Filters */}
                    {showFilters && filterable && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-navy-700 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {columns.filter(col => col.filterable).map(column => (
                                    <div key={column.key}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {column.title}
                                        </label>
                                        <input
                                            type="text"
                                            value={filters[column.accessor] || ''}
                                            onChange={(e) => setFilters(prev => ({
                                                ...prev,
                                                [column.accessor]: e.target.value
                                            }))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-800 dark:text-white"
                                            placeholder={`Filter by ${column.title.toLowerCase()}...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-navy-700">
                        <tr>
                            {selectable && (
                                <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                            )}
                            {columns.map(column => (
                                <th
                                    key={column.key}
                                    className={clsx(
                                        'px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                                        sortable && column.sortable !== false && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-600'
                                    )}
                                    onClick={() => column.sortable !== false && handleSort(column.accessor)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.title}</span>
                                        {sortable && column.sortable !== false && getSortIcon(column.accessor)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-navy-600">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <tr
                                    key={index}
                                    className={clsx(
                                        'hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors',
                                        onRowClick && 'cursor-pointer',
                                        selectedRows.has(index) && 'bg-blue-50 dark:bg-blue-900/20'
                                    )}
                                    onClick={() => onRowClick && onRowClick(item, index)}
                                >
                                    {selectable && (
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.has(index)}
                                                onChange={() => handleSelectRow(index)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                    )}
                                    {columns.map(column => (
                                        <td
                                            key={column.key}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                                        >
                                            {renderCell(item, column, index)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center">
                                    {emptyState || (
                                        <div className="text-gray-500 dark:text-gray-400">
                                            <div className="text-4xl mb-4">📋</div>
                                            <p className="text-lg font-medium mb-2">No data found</p>
                                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-navy-600">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                                Previous
                            </Button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={clsx(
                                                'px-3 py-1 text-sm rounded-md transition-colors',
                                                currentPage === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-600'
                                            )}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRightIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;