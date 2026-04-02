import { Plus, Upload, UserRound, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useRef } from 'react';
import { useI18n } from '@/translate';

const FORM_FIELDS = [
    { key: 'name', label: 'Name', type: 'text' },
    {
        key: 'gender',
        label: 'Gender',
        type: 'select',
        options: ['female', 'male', 'non-binary'],
    },
    {
        key: 'apparent_age',
        label: 'Apparent Age',
        type: 'select',
        options: ['early-20s', 'mid-20s', 'late-20s', 'early-30s'],
    },
    {
        key: 'ethnicity',
        label: 'Ethnicity',
        type: 'select',
        options: ['vietnamese', 'east-asian', 'korean-look', 'mixed-asian'],
    },
    {
        key: 'face_shape',
        label: 'Face Shape',
        type: 'select',
        options: ['oval', 'round', 'v-line', 'heart'],
    },
    {
        key: 'default_expression',
        label: 'Default Expression',
        type: 'select',
        options: ['confident', 'professional', 'friendly', 'calm'],
    },
    {
        key: 'eye_type',
        label: 'Eye Type',
        type: 'select',
        options: ['almond', 'sharp', 'round', 'wide'],
    },
    {
        key: 'hair_style',
        label: 'Hair Style',
        type: 'select',
        options: ['long-straight', 'long-wavy', 'shoulder-length', 'bob', 'ponytail'],
    },
    {
        key: 'hair_color',
        label: 'Hair Color',
        type: 'select',
        options: ['black', 'dark-brown', 'light-brown', 'ash-brown'],
    },
    {
        key: 'skin_tone',
        label: 'Skin Tone',
        type: 'select',
        options: ['light-warm', 'light', 'medium', 'tan'],
    },
    {
        key: 'body_type',
        label: 'Body Type',
        type: 'select',
        options: ['slim', 'fit', 'petite', 'curvy'],
    },
];

const LEFT_FIELDS = [
    'name',
    'gender',
    'apparent_age',
    'ethnicity',
    'face_shape',
    'default_expression',
];

const RIGHT_FIELDS = [
    'eye_type',
    'hair_style',
    'hair_color',
    'skin_tone',
    'body_type',
];

const getFieldByKey = (key) => FORM_FIELDS.find((field) => field.key === key);

function RenderField({ field, form, onUpdateField, __ }) {
    if (!field) return null;

    const isLocked = form.image_locked && field.key !== 'name';

    return (
        <div className="w-full min-w-0">
            <label className="mb-2 block text-[0.85rem] font-semibold text-slate-700">
                {__(field.label)}
                {field.key === 'name' && <span className="ml-1 text-rose-500">*</span>}
            </label>

            {field.type === 'select' ? (
                <select
                    value={form[field.key]}
                    onChange={(e) => onUpdateField(field.key, e.target.value)}
                    disabled={isLocked}
                    className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-[0.9rem] focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                >
                    {field.options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type="text"
                    value={form[field.key]}
                    onChange={(e) => onUpdateField(field.key, e.target.value)}
                    readOnly={isLocked && field.key !== 'name'}
                    className={`h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-[0.9rem] focus:border-indigo-500 focus:ring-indigo-500 ${
                        isLocked && field.key !== 'name' ? 'bg-slate-100 text-slate-500' : ''
                    }`}
                    placeholder={field.label}
                />
            )}
        </div>
    );
}

export default function AddDialog({
    open,
    form,
    onClose,
    onSubmit,
    onUpdateField,
    onImageSelect,
}) {
    const { __ } = useI18n();
    const imageInputRef = useRef(null);

    const clearImageSelection = () => {
        onUpdateField('image_url', '');
        onUpdateField('image_file', null);
        onUpdateField('image_locked', false);

        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    if (!open || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-[100]">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="absolute inset-0 overflow-y-auto p-4 sm:p-6">
                <div
                    className="mx-auto overflow-hidden rounded-[32px] border border-indigo-100 bg-white shadow-[0_35px_100px_-25px_rgba(79,70,229,0.35)]"
                    style={{ width: 'min(33vw, 880px)' }}
                >
                    <div className="sticky top-0 z-20 flex items-center justify-between rounded-t-[32px] border-b border-indigo-100 bg-purple-600 px-4 py-3 text-white">
                        <div>
                            <h3 className="text-lg font-bold">{__('Add New KOL')}</h3>
                            <p className="mt-1 text-xs text-purple-100 sm:text-sm">
                                {__('Upload a KOL image to auto-fill profile attributes. After upload, only Name remains editable.')}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-600 text-white shadow-md hover:bg-rose-700"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={onSubmit} className="p-3">
                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_220px]">
                            {/* Form panel */}
                            <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-3 sm:p-4">
                                <div className="flex gap-20">
                                    <div className="space-y-3 flex-1">
                                        {LEFT_FIELDS.map((fieldKey) => (
                                            <RenderField
                                                key={fieldKey}
                                                field={getFieldByKey(fieldKey)}
                                                form={form}
                                                onUpdateField={onUpdateField}
                                                __={__}
                                            />
                                        ))}
                                    </div>

                                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            {RIGHT_FIELDS.map((fieldKey) => (
                                                <RenderField
                                                    key={fieldKey}
                                                    field={getFieldByKey(fieldKey)}
                                                    form={form}
                                                    onUpdateField={onUpdateField}
                                                    __={__}
                                                />
                                            ))}
                                        </div>

                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2 font-semibold text-white hover:bg-indigo-700 w-fit"
                                        >
                                            <Plus size={16} />
                                            {__('Create KOL')}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Preview panel */}
                            <div className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50 p-2">
                                <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                    <div className="text-center text-sm font-semibold text-slate-800">
                                        {__('Choose KOL from your computer')}
                                    </div>

                                    <div className="mt-2 flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 p-2">
                                        {form.image_url ? (
                                            <img
                                                src={form.image_url}
                                                alt="KOL preview"
                                                className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover"
                                            />
                                        ) : (
                                            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400">
                                                <UserRound size={16} />
                                            </span>
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-300 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100">
                                                <Upload size={16} />
                                                {__('Upload image')}
                                                <input
                                                    ref={imageInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={onImageSelect}
                                                    className="hidden"
                                                />
                                            </label>

                                            <p className="mt-2 truncate text-xs text-slate-500">
                                                {form.image_url ? __('Image selected') : __('Choose a KOL image from your computer')}
                                            </p>
                                        </div>

                                        {form.image_url && (
                                            <button
                                                type="button"
                                                onClick={clearImageSelection}
                                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                                                aria-label={__('Clear selected image')}
                                                title={__('Clear selected image')}
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>

                                    <p className="mt-3 text-xs leading-relaxed text-slate-500">
                                        {form.image_locked
                                            ? __('Image uploaded. Only Name KOL can be edited.')
                                            : __('Choose a KOL image from your computer to auto-fill the profile attributes.')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body,
    );
}