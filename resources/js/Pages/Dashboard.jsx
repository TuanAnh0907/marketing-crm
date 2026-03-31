import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Users, Megaphone, BarChart2, TrendingUp } from 'lucide-react';

const stats = [
    { label: 'Total Contacts', value: '0', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Campaigns', value: '0', icon: Megaphone, color: 'bg-indigo-500' },
    { label: 'Total Reports', value: '0', icon: BarChart2, color: 'bg-purple-500' },
    { label: 'Growth', value: '0%', icon: TrendingUp, color: 'bg-emerald-500' },
];

export default function Dashboard() {
    const { auth, appName } = usePage().props;

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Welcome banner */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Welcome back, {auth.user.name} 👋
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Here's what's going on with {appName} today.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4"
                    >
                        <div className={`${color} p-3 rounded-xl`}>
                            <Icon size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder content */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-4">Recent Activity</h3>
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <BarChart2 size={36} className="mb-2 opacity-30" />
                        <p className="text-sm">No activity yet</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-4">Top Campaigns</h3>
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <Megaphone size={36} className="mb-2 opacity-30" />
                        <p className="text-sm">No campaigns yet</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
