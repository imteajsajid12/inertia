import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Layout/Sidebar';
import Topbar from '@/Components/Layout/Topbar';
import Breadcrumb from '@/Components/Layout/Breadcrumb';
import clsx from 'clsx';

const AdminLayout = ({ children, title, breadcrumbs = [] }) => {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className={clsx('min-h-screen bg-gray-50 dark:bg-navy-900', darkMode && 'dark')}>
            {/* Sidebar - Fixed positioning */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                userRole="admin"
            />

            {/* Main content area - Properly offset for fixed sidebar */}
            <div className="lg:pl-72">
                {/* Topbar - Spans the main content width */}
                <Topbar
                    onMenuClick={() => setSidebarOpen(true)}
                    title={title}
                    user={auth.user}
                    darkMode={darkMode}
                    onToggleDarkMode={toggleDarkMode}
                />

                {/* Page content - Optimized spacing */}
                <main className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-navy-900">
                    <div className="px-4 sm:px-6 lg:px-8 py-6">
                        {breadcrumbs.length > 0 && (
                            <div className="mb-6">
                                <Breadcrumb items={breadcrumbs} />
                            </div>
                        )}

                        {/* Content container - Full width utilization */}
                        <div className="w-full">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;