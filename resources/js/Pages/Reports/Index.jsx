import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { useI18n } from '@/translate';

export default function Index() {
    const { __ } = useI18n();

    return (
        <AppLayout title="Reports">
            <Head title={__('Reports')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">{__('Reports')}</h2>
                        <p className="text-gray-600">{__('This is the reports management page.')}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
