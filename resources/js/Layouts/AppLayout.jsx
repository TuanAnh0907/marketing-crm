import {Link, router, usePage} from '@inertiajs/react';
import {useState} from 'react';
import {BarChart2, ChevronRight, Globe, LayoutDashboard, LogOut, Megaphone, Menu, Settings, Users, X,} from 'lucide-react';
import { useI18n } from '../translate';
import LanguageSwitcher from '../Components/LanguageSwitcher';
import {Disclosure} from "@headlessui/react";

const navItems = [
    {label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard},
    {label: 'Contacts', href: '/contacts', icon: Users},
    {
        label: 'Campaigns',
        icon: Megaphone,
        children: [
            {label: 'All Campaigns', href: '/campaigns'},
            {label: 'Create New', href: '/campaigns/create'},
        ]
    },
    {label: 'Reports', href: '/reports', icon: BarChart2},
    {
        label: 'Settings',
        icon: Settings,
        children: [
            {label: 'Profile', href: '/settings/profile'},
            {label: 'Security', href: '/settings/security'},
        ]
    },
];

export default function AppLayout({title = 'Dashboard', children}) {
    const {auth, locale} = usePage().props;
    const { __ } = useI18n();
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
                            <Megaphone size={16} className="text-white"/>
                        </div>
                        <span className="text-white font-semibold text-sm">Marketing CRM</span>
                    </div>
                    <button
                        className="lg:hidden text-gray-400 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={18}/>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const hasChildren = !!item.children;
                        const isChildActive = hasChildren && item.children.some(child => currentPath === child.href);
                        const isActive = currentPath === item.href || isChildActive;

                        if (hasChildren) {
                            return (
                                <Disclosure key={item.label} defaultOpen={isChildActive}>
                                    {({open}) => (
                                        <>
                                            <Disclosure.Button
                                                className={`
                                                    flex w-full items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                                    transition-colors duration-150
                                                    ${isActive
                                                    ? 'text-white'
                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                                }
                                                `}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={18}/>
                                                    {__(item.label)}
                                                </div>
                                                <ChevronRight
                                                    size={14}
                                                    className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="mt-1 space-y-0.5 px-9">
                                                {item.children.map((child) => {
                                                    const childActive = currentPath === child.href;
                                                    return (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href}
                                                            className={`
                                                                block py-2 text-sm transition-colors duration-150
                                                                ${childActive
                                                                ? 'text-indigo-400 font-semibold'
                                                                : 'text-gray-500 hover:text-white'
                                                            }
                                                            `}
                                                        >
                                                            {__(child.label)}
                                                        </Link>
                                                    );
                                                })}
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                    transition-colors duration-150
                                    ${isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }
                                `}
                            >
                                <item.icon size={18}/>
                                {__(item.label)}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="px-3 py-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
                        <div
                            className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold uppercase">
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
                        <LogOut size={16}/>
                        {__('Logout')}
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
                        <Menu size={20}/>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">{__(title)}</h1>

                    <div className="ml-auto flex items-center gap-4">
                        <LanguageSwitcher />
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
