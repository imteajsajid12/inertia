import React, { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Bars3Icon,
    BellIcon,
    MagnifyingGlassIcon,
    SunIcon,
    MoonIcon,
    UserIcon,
    CogIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';

const Topbar = ({ onMenuClick, title, user, darkMode, onToggleDarkMode }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const userMenuRef = useRef(null);
    const notificationRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        router.post('/logout');
    };

    const notifications = [
        { id: 1, title: 'New subscription', message: 'John Doe subscribed to Pro plan', time: '2 min ago', unread: true },
        { id: 2, title: 'Payment received', message: 'Payment of $29.99 received', time: '1 hour ago', unread: true },
        { id: 3, title: 'Plan upgraded', message: 'Jane Smith upgraded to Enterprise', time: '3 hours ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-navy-700/50">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Left side */}
                <div className="flex items-center">
                    <button
                        onClick={onMenuClick}
                        className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-navy-700 transition-all duration-200 lg:hidden"
                    >
                        <Bars3Icon className="h-5 w-5" />
                    </button>

                    <div className="ml-4 lg:ml-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Search bar (hidden on mobile) */}
                <div className="hidden md:block flex-1 max-w-lg mx-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-navy-600 rounded-2xl bg-gray-50 dark:bg-navy-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-2">
                    {/* Dark mode toggle */}
                    <button
                        onClick={onToggleDarkMode}
                        className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-xl transition-all duration-200"
                    >
                        {darkMode ? (
                            <SunIcon className="h-5 w-5" />
                        ) : (
                            <MoonIcon className="h-5 w-5" />
                        )}
                    </button>

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-xl transition-all duration-200"
                        >
                            {unreadCount > 0 ? (
                                <BellIconSolid className="h-5 w-5 text-brand-600" />
                            ) : (
                                <BellIcon className="h-5 w-5" />
                            )}
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white dark:ring-navy-800">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50">
                                <div className="p-4 border-b border-gray-100 dark:border-navy-700">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <span className="px-2 py-1 text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900/20 dark:text-brand-400 rounded-full">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={clsx(
                                                'p-4 border-b border-gray-50 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-700 cursor-pointer transition-colors duration-150',
                                                notification.unread && 'bg-brand-50/50 dark:bg-brand-900/10'
                                            )}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className={clsx(
                                                    'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                                                    notification.unread ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'
                                                )} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 text-center border-t border-gray-100 dark:border-navy-700">
                                    <Link
                                        href="/notifications"
                                        className="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 transition-colors duration-150"
                                    >
                                        View all notifications
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User menu */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.email || 'user@example.com'}
                                </p>
                            </div>
                            <ChevronDownIcon className="hidden md:block w-4 h-4 text-gray-400" />
                        </button>

                        {/* User dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50">
                                <div className="p-2">
                                    <div className="px-3 py-2 border-b border-gray-100 dark:border-navy-700 mb-2">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {user?.email || 'user@example.com'}
                                        </p>
                                    </div>

                                    <Link
                                        href="/profile"
                                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-xl transition-colors duration-150"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <UserIcon className="mr-3 h-4 w-4" />
                                        Profile Settings
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-xl transition-colors duration-150"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <CogIcon className="mr-3 h-4 w-4" />
                                        Account Settings
                                    </Link>
                                    <hr className="my-2 border-gray-100 dark:border-navy-700" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-150"
                                    >
                                        <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;