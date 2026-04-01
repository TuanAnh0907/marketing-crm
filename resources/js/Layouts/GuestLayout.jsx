import {usePage} from '@inertiajs/react';
import {Megaphone} from 'lucide-react';

export default function GuestLayout({title, children}) {
    const {appName} = usePage().props;

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4">
                        <Megaphone size={24} className="text-white"/>
                    </div>
                    <h1 className="text-xl font-bold text-white">{appName}</h1>
                    {title && (
                        <p className="text-gray-400 text-sm mt-1">{title}</p>
                    )}
                </div>

                {/* Card */}
                <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
