import {Head, usePage} from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {BarChart2, Megaphone, TrendingDown, TrendingUp, Users, Plus, ArrowRight} from 'lucide-react';
import { useI18n } from '@/translate';

export default function Dashboard({ stats: propStats, recentActivity }) {
    const { auth } = usePage().props;
    const { __ } = useI18n();

    // Map the icons and colors for stats
    const iconMap = {
        'Total Contacts': Users,
        'Active Campaigns': Megaphone,
        'Total Reports': BarChart2,
        'Growth': TrendingUp,
    };

    const colorMap = {
        'Total Contacts': 'bg-blue-600',
        'Active Campaigns': 'bg-indigo-600',
        'Total Reports': 'bg-purple-600',
        'Growth': 'bg-emerald-600',
    };

    return (
        <AppLayout title="Dashboard">
            <Head title={__('Dashboard')} />

            {/* Welcome banner */}
            <div className="mb-8 p-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold">
                        {__('Welcome back')}, {auth.user.name} 👋
                    </h2>
                    <p className="text-indigo-100 mt-2 text-lg max-w-xl">
                        {__("Here's a quick overview of what's happening with your Marketing CRM today.")}
                    </p>
                    <div className="flex gap-3 mt-6">
                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2">
                             <Plus size={16} /> {__('Add Contact')}
                        </button>
                        <button className="bg-indigo-500/30 text-white border border-indigo-400/30 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-500/50 transition-colors flex items-center gap-2">
                            {__('New Campaign')}
                        </button>
                    </div>
                </div>
                {/* Decorative element */}
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-20%] right-[10%] w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(propStats || []).map((stat) => {
                    const Icon = iconMap[stat.label] || TrendingUp;
                    const color = colorMap[stat.label] || 'bg-gray-600';
                    return (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${color} p-3 rounded-xl text-white shadow-lg shadow-${color.split('-')[1]}-100 group-hover:scale-110 transition-transform`}>
                                    <Icon size={20} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendingUp ? 'text-emerald-500' : 'text-rose-500'} bg-gray-50 px-2 py-1 rounded-full`}>
                                    {stat.trendingUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
                                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">{__(stat.label)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main grid */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity timeline */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-gray-900">{__('Recent Activity')}</h3>
                        <button className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:underline">
                            {__('View all')} <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                        {(recentActivity || []).map((activity) => (
                            <div key={activity.id} className="relative pl-12">
                                <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10
                                    ${activity.type === 'contact' ? 'bg-blue-100 text-blue-600' :
                                      activity.type === 'campaign' ? 'bg-indigo-100 text-indigo-600' :
                                      'bg-purple-100 text-purple-600'}`}>
                                    {activity.type === 'contact' ? <Users size={16} /> :
                                     activity.type === 'campaign' ? <Megaphone size={16} /> :
                                     <BarChart2 size={16} />}
                                </div>
                                <div>
                                    <p className="text-gray-900 font-semibold text-base">
                                        <span className="text-indigo-600">{activity.user}</span> {activity.action}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right panel - Marketing Tips / Quick Stats */}
                <div className="space-y-8">
                    <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100 relative overflow-hidden">
                        <h4 className="text-indigo-900 font-bold text-lg mb-2 relative z-10">{__('Quick Pro Tip')}</h4>
                        <p className="text-indigo-700 text-sm leading-relaxed mb-4 relative z-10">
                            {__('Segmenting your contacts by location can increase your email open rates by up to 15%. Try it in your next campaign!')}
                        </p>
                        <button className="bg-indigo-600 text-white w-full py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all relative z-10">
                            {__('Explore Segments')}
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h4 className="text-gray-900 font-bold text-lg mb-6">{__('Top Performing')}</h4>
                        <div className="space-y-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-bold text-gray-400">
                                        # {i}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-end mb-1">
                                            <p className="text-sm font-bold text-gray-800">Summer Sale {i}</p>
                                            <p className="text-xs font-bold text-emerald-500">88%</p>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full rounded-full" style={{width: i === 1 ? '88%' : '75%'}}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
