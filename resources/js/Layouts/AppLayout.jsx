import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Megaphone,
    BarChart2,
    Settings,
    LogOut,
    ChevronDown,
    Menu,
    X,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Contacts', href: '/contacts', icon: Users },
    { label: 'Campaigns', href: '/campaigns', icon: Megaphone },
    { label: 'Reports', href: '/reports', icon: BarChart2 },
    { label: 'Settings', href: '/settings', icon: Settings },
];

export default function AppLayout({ title = 'Dashboard', children }) {
    const { auth, appName } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const logout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const currentPath = window.location.pathname;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 flex flex-col
                    transform transition-transform duration-200 ease-in-out
                    lg:static lg:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Megaphone size={16} className="text-white" />
                        </div>
                        <span className="text-white font-semibold text-sm">{appName}</span>
                    </div>
                    <button
                        className="lg:hidden text-gray-400 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = currentPath === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                    transition-colors duration-150
                                    ${active
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }
                                `}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="px-3 py-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold uppercase">
                            {auth?.user?.name?.charAt(0) ?? 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{auth?.user?.name}</p>
                            <p className="text-gray-400 text-xs truncate">{auth?.user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="mt-1 flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
                    <button
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
