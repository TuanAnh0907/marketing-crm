import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AddDialog from './AddDialog';
import { useI18n } from '@/translate';

const TABLE_COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'image', label: 'Image' },
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
];

const EMPTY_FORM = {
    name: '',
    gender: 'female',
    apparent_age: 'early-20s',
    ethnicity: 'vietnamese',
    face_shape: 'oval',
    default_expression: 'confident',
    eye_type: 'almond',
    hair_style: 'long-straight',
    hair_color: 'black',
    skin_tone: 'light-warm',
    body_type: 'slim',
    image_url: '',
    image_file: null,
    image_locked: false,
};

const FIELD_OPTION_MAP = {
    gender: ['female', 'male', 'non-binary'],
    apparent_age: ['early-20s', 'mid-20s', 'late-20s', 'early-30s'],
    ethnicity: ['vietnamese', 'east-asian', 'korean-look', 'mixed-asian'],
    face_shape: ['oval', 'round', 'v-line', 'heart'],
    default_expression: ['confident', 'professional', 'friendly', 'calm'],
    eye_type: ['almond', 'sharp', 'round', 'wide'],
    hair_style: ['long-straight', 'long-wavy', 'shoulder-length', 'bob', 'ponytail'],
    hair_color: ['black', 'dark-brown', 'light-brown', 'ash-brown'],
    skin_tone: ['light-warm', 'light', 'medium', 'tan'],
    body_type: ['slim', 'fit', 'petite', 'curvy'],
};

const normalizeKol = (kol) => ({
    ...kol,
    image_url: kol.image_url || null,
    is_local: !!kol.is_local,
});

const hashString = (input = '') => {
    let hash = 0;

    for (let index = 0; index < input.length; index += 1) {
        hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
    }

    return hash;
};

const pickBySeed = (options, seed, offset = 0) => options[(seed + offset) % options.length];

const createRandomProfile = (seedText = '') => {
    const seed = hashString(seedText);

    return {
        gender: pickBySeed(FIELD_OPTION_MAP.gender, seed, 0),
        apparent_age: pickBySeed(FIELD_OPTION_MAP.apparent_age, seed, 1),
        ethnicity: pickBySeed(FIELD_OPTION_MAP.ethnicity, seed, 2),
        face_shape: pickBySeed(FIELD_OPTION_MAP.face_shape, seed, 3),
        default_expression: pickBySeed(FIELD_OPTION_MAP.default_expression, seed, 4),
        eye_type: pickBySeed(FIELD_OPTION_MAP.eye_type, seed, 5),
        hair_style: pickBySeed(FIELD_OPTION_MAP.hair_style, seed, 6),
        hair_color: pickBySeed(FIELD_OPTION_MAP.hair_color, seed, 7),
        skin_tone: pickBySeed(FIELD_OPTION_MAP.skin_tone, seed, 8),
        body_type: pickBySeed(FIELD_OPTION_MAP.body_type, seed, 9),
    };
};

const createEmptyForm = () => ({ ...EMPTY_FORM });

const makeSlug = (name) => {
    const slug = (name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return slug || 'kol';
};

export default function Index({ kols: initialKols = [] }) {
    const { __ } = useI18n();
    const [items, setItems] = useState(() => initialKols.map(normalizeKol));
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState(createEmptyForm);
    const [notice, setNotice] = useState(null);

    const openAddDialog = () => {
        setForm(createEmptyForm());
        setDialogOpen(true);
        setNotice(null);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setForm(createEmptyForm());
    };

    const updateForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target?.result || '';
            const randomProfile = createRandomProfile(file.name);

            setForm((prev) => ({
                ...prev,
                ...randomProfile,
                name: prev.name || `KOL ${items.length + 1}`,
                image_url: imageUrl,
                image_file: file,
                image_locked: true,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            setNotice({ type: 'error', message: __('Please fill in KOL Name.') });
            return;
        }

        if (!form.image_url) {
            setNotice({ type: 'error', message: __('Please choose a KOL image.') });
            return;
        }

        const slug = `${makeSlug(form.name)}-${Date.now()}`;
        const newKol = normalizeKol({
            slug,
            name: form.name.trim(),
            gender: form.gender,
            apparent_age: form.apparent_age,
            ethnicity: form.ethnicity,
            face_shape: form.face_shape,
            default_expression: form.default_expression,
            eye_type: form.eye_type,
            hair_style: form.hair_style,
            hair_color: form.hair_color,
            skin_tone: form.skin_tone,
            body_type: form.body_type,
            image_url: form.image_url,
            is_local: true,
        });

        setItems((prev) => [newKol, ...prev]);
        setNotice({ type: 'success', message: __('KOL has been added.') });
        closeDialog();
    };

    const deleteKol = (slug) => {
        if (!window.confirm(__('Delete this KOL?'))) {
            return;
        }

        setItems((prev) => prev.filter((item) => item.slug !== slug));
        setNotice({ type: 'success', message: __('KOL has been deleted.') });
    };

    return (
        <AppLayout title="KOL">
            <Head title={__('KOL')} />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-extrabold text-indigo-700">
                            {__('KOL')}
                        </h2>
                        <p className="text-slate-600">
                            {__('Manage KOL profiles and social configuration.')}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddDialog}
                        className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 whitespace-nowrap"
                    >
                        <Plus size={16} />
                        {__('Add New KOL')}
                    </button>
                </div>

                {notice && (
                    <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${notice.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                        {notice.message}
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {TABLE_COLUMNS.map((column) => (
                                    <th key={column.key} className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">
                                        {__(column.label)}
                                    </th>
                                ))}
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">{__('Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((kol) => (
                                <tr key={kol.slug} className="border-b border-gray-100 hover:bg-indigo-50/40 transition-colors align-top">
                                    {TABLE_COLUMNS.map((column) => (
                                        <td key={column.key} className="py-3 px-4 text-gray-800 whitespace-nowrap">
                                            {column.key === 'name' ? (
                                                kol.is_local ? (
                                                    <span className="font-semibold text-indigo-700">{kol.name}</span>
                                                ) : (
                                                    <Link href={`/kols/${kol.slug}`} className="font-semibold text-indigo-700 hover:underline">
                                                        {kol.name}
                                                    </Link>
                                                )
                                            ) : column.key === 'image' ? (
                                                kol.image_url ? (
                                                    <div className="group relative inline-block">
                                                        <img
                                                            src={kol.image_url}
                                                            alt={kol.name}
                                                            className="h-12 w-12 rounded-full border border-gray-200 object-cover shadow-sm"
                                                        />
                                                        <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-3 hidden -translate-x-1/2 group-hover:block">
                                                            <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl">
                                                                <img
                                                                    src={kol.image_url}
                                                                    alt={`${kol.name} preview`}
                                                                    className="h-56 w-56 rounded-xl object-cover"
                                                                />
                                                                <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
                                                                    <Eye size={14} />
                                                                    {__('Image preview')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 bg-slate-50">
                                                        {__('No image')}
                                                    </span>
                                                )
                                            ) : (
                                                <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                                    {kol[column.key]}
                                                </span>
                                            )}
                                        </td>
                                    ))}

                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <button
                                            type="button"
                                            onClick={() => deleteKol(kol.slug)}
                                            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-2 font-semibold text-white hover:bg-rose-700"
                                        >
                                            <Trash2 size={14} />
                                            {__('Delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddDialog
                open={dialogOpen}
                form={form}
                onClose={closeDialog}
                onSubmit={handleSubmit}
                onUpdateField={updateForm}
                onImageSelect={handleImageSelect}
            />
        </AppLayout>
    );
}
