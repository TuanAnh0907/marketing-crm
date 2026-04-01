import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { ExternalLink, UserRound } from 'lucide-react';
import { useI18n } from '@/translate';

const TABLE_COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'apparent_age', label: 'Apparent Age' },
    { key: 'ethnicity', label: 'Ethnicity' },
    { key: 'face_shape', label: 'Face Shape' },
    { key: 'default_expression', label: 'Default Expression' },
    { key: 'eye_type', label: 'Eye Type' },
    { key: 'hair_style', label: 'Hair Style' },
    { key: 'hair_color', label: 'Hair Color' },
    { key: 'skin_tone', label: 'Skin Tone' },
    { key: 'body_type', label: 'Body Type' },
    { key: 'tiktok_url', label: 'TikTok' },
];

export default function Index({ kols = [] }) {
    const { __ } = useI18n();

    return (
        <AppLayout title="KOL">
            <Head title={__('KOL')} />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-3xl p-6 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                            <UserRound size={22} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{__('KOL Directory')}</h2>
                            <p className="text-indigo-100 mt-1">
                                {__('Select a KOL from the table to open profile settings and social configuration.')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {TABLE_COLUMNS.map((column) => (
                                    <th key={column.key} className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">
                                        {__(column.label)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {kols.map((kol) => (
                                <tr key={kol.slug} className="border-b border-gray-100 hover:bg-indigo-50/40 transition-colors">
                                    {TABLE_COLUMNS.map((column) => (
                                        <td key={column.key} className="py-3 px-4 text-gray-800 whitespace-nowrap">
                                            {column.key === 'name' ? (
                                                <Link href={`/kols/${kol.slug}`} className="font-semibold text-indigo-700 hover:underline">
                                                    {kol.name}
                                                </Link>
                                            ) : column.key === 'tiktok_url' ? (
                                                <a
                                                    href={kol.tiktok_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {__('Open')}
                                                    <ExternalLink size={13} />
                                                </a>
                                            ) : (
                                                <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                                    {kol[column.key]}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
