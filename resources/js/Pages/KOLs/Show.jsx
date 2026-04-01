import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, Save, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/translate';

const FIELDS = [
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
    { key: 'tiktok_url', label: 'TikTok URL' },
];

export default function Show({ kol }) {
    const { __ } = useI18n();
    const [form, setForm] = useState(kol);

    const onChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <AppLayout title="KOL">
            <Head title={`${kol.name} - ${__('KOL Settings')}`} />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between gap-3">
                    <Link href="/kols" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:underline">
                        <ArrowLeft size={16} />
                        {__('Back to KOL list')}
                    </Link>
                    <a
                        href={form.tiktok_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors"
                    >
                        {__('Open TikTok Channel')}
                        <ExternalLink size={16} />
                    </a>
                </div>

                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-3xl p-6 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                            <UserRound size={22} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{form.name}</h2>
                            <p className="text-indigo-100 mt-1">
                                {__('Configure profile attributes and social link mapping for this KOL.')}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {FIELDS.map((field) => (
                            <div key={field.key} className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {__(field.label)}
                                </label>
                                <input
                                    type={field.key === 'tiktok_url' ? 'url' : 'text'}
                                    value={form[field.key] || ''}
                                    onChange={(e) => onChange(field.key, e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder={field.label}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            <Save size={16} />
                            {__('Save KOL Profile')}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
