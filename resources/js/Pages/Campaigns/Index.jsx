import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { useI18n } from '@/translate';

export default function Index() {
    const { __ } = useI18n();

    return (
        <AppLayout title="Campaigns">
            <Head title={__('Campaigns')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">{__('All Campaigns')}</h2>
                        <p className="text-gray-600">{__('This is the campaigns listing page.')}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
