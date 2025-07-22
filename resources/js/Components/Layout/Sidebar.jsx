import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UsersIcon,
    CreditCardIcon,
    DocumentTextIcon,
    CogIcon,
    ChartBarIcon,
    UserIcon,
    ShieldCheckIcon,
    XMarkIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    UsersIcon as UsersIconSolid,
    CreditCardIcon as CreditCardIconSolid,
    DocumentTextIcon as DocumentTextIconSolid,
    CogIcon as CogIconSolid,
    ChartBarIcon as ChartBarIconSolid,
    UserIcon as UserIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';
import clsx from 'clsx';

const Sidebar = ({ isOpen, onClose, userRole = 'client' }) => {
    const { url } = usePage();
    const { auth } = usePage().props;
    const user = auth?.user;

    const adminNavigation = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: HomeIcon,
            iconSolid: HomeIconSolid,
            description: 'Overview & Analytics'
        },
        {
            name: 'Users',
            href: '/admin/users',
            icon: UsersIcon,
            iconSolid: UsersIconSolid,
            description: 'Manage Users & Roles'
        },
        {
            name: 'Plans',
            href: '/admin/plans',
            icon: CreditCardIcon,
            iconSolid: CreditCardIconSolid,
            description: 'Subscription Plans'
        },
        {
            name: 'Subscriptions',
            href: '/admin/subscriptions',
            icon: ChartBarIcon,
            iconSolid: ChartBarIconSolid,
            description: 'Active Subscriptions'
        },
        {
            name: 'Roles & Permissions',
            href: '/admin/roles',
            icon: ShieldCheckIcon,
            iconSolid: ShieldCheckIconSolid,
            description: 'Access Control'
        },
        {
            name: 'Settings',
            href: '/admin/settings',
            icon: CogIcon,
            iconSolid: CogIconSolid,
            description: 'System Configuration'
        },
    ];

    const clientNavigation = [
        {
            name: 'Dashboard',
            href: '/client/dashboard',
            icon: HomeIcon,
            iconSolid: HomeIconSolid,
            description: 'Your Overview'
        },
        {
            name: 'Plans',
            href: '/client/plans',
            icon: CreditCardIcon,
            iconSolid: CreditCardIconSolid,
            description: 'Browse Plans'
        },
        {
            name: 'Invoices',
            href: '/client/invoices',
            icon: DocumentTextIcon,
            iconSolid: DocumentTextIconSolid,
            description: 'Billing History'
        },
        {
            name: 'Payment Methods',
            href: '/client/payment-methods',
            icon: CreditCardIcon,
            iconSolid: CreditCardIconSolid,
            description: 'Manage Payments'
        },
        {
            name: 'Profile',
            href: '/profile',
            icon: UserIcon,
            iconSolid: UserIconSolid,
            description: 'Account Settings'
        },
    ];

    const navigation = userRole === 'admin' ? adminNavigation : clientNavigation;

    const isActive = (href) => {
        if (href === '/dashboard') {
            return url === href;
        }
        return url.startsWith(href);
    };

    const NavItem = ({ item }) => {
        const active = isActive(item.href);
        const IconComponent = active ? item.iconSolid : item.icon;

        return (
            <Link
                href={item.href}
                className={clsx(
                    'group relative flex items-center px-3 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ease-in-out',
                    active
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-navy-700 dark:hover:text-white'
                )}
            >
                {/* Active indicator */}
                {active && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}

                <div className={clsx(
                    'flex items-center justify-center w-10 h-10 rounded-xl mr-3 transition-all duration-200',
                    active
                        ? 'bg-white/20'
                        : 'bg-gray-100 group-hover:bg-brand-50 dark:bg-navy-700 dark:group-hover:bg-brand-900/20'
                )}>
                    <IconComponent
                        className={clsx(
                            'w-5 h-5 transition-colors duration-200',
                            active
                                ? 'text-white'
                                : 'text-gray-500 group-hover:text-brand-600 dark:text-gray-400 dark:group-hover:text-brand-400'
                        )}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className={clsx(
                        'font-semibold transition-colors duration-200',
                        active ? 'text-white' : 'text-gray-900 dark:text-white'
                    )}>
                        {item.name}
                    </div>
                    <div className={clsx(
                        'text-xs mt-0.5 transition-colors duration-200',
                        active
                            ? 'text-white/80'
                            : 'text-gray-500 group-hover:text-gray-600 dark:text-gray-400'
                    )}>
                        {item.description}
                    </div>
                </div>

                {/* Hover effect */}
                {!active && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
                )}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={clsx(
                'fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-navy-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0',
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="relative px-6 py-8 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700">
                        {/* Close button for mobile */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>

                        {/* Logo and branding */}
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <BuildingOfficeIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    {userRole === 'admin' ? 'Admin Panel' : 'SaaS Platform'}
                                </h1>
                                <p className="text-sm text-white/80">
                                    {userRole === 'admin' ? 'Management Console' : 'Client Dashboard'}
                                </p>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        <div className="mb-6">
                            <h2 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Navigation
                            </h2>
                        </div>

                        {navigation.map((item) => (
                            <NavItem key={item.name} item={item} />
                        ))}
                    </nav>

                    {/* User Profile Section */}
                    <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-navy-700 bg-gray-50 dark:bg-navy-900/50">
                        <div className="flex items-center p-3 rounded-2xl bg-white dark:bg-navy-800 shadow-sm">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                                    <span className="text-sm font-semibold text-white">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.email || 'user@example.com'}
                                </p>
                            </div>
                            <div className="ml-2">
                                <div className={clsx(
                                    'px-2 py-1 text-xs font-medium rounded-lg',
                                    userRole === 'admin'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                )}>
                                    {userRole === 'admin' ? 'Admin' : 'Client'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;