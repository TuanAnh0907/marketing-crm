import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Check, ExternalLink, FileImage, ImageOff, ImagePlus, Plus, Search, Send, Trash2, Upload, Video, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useI18n } from '@/translate';

const EMPTY_FORM = {
    product_name: '',
    product_photo_file: null,
    product_photo_url: '',
    product_description: '',
    kol_name: '',
    video_files: [],
    video_count: 1,
    video_url: '',
};

const normalizeVideoItem = (item) => {
    const legacyStatus = item.publish_status;
    const derivedVideoStatus = item.video_status
        || (legacyStatus === 'pending' ? 'pending' : null)
        || (legacyStatus === 'not_uploaded' ? 'not_uploaded' : null)
        || (legacyStatus === 'uploaded' ? 'uploaded' : null)
        || (item.video_url ? 'uploaded' : 'not_uploaded');

    const derivedPostStatus = item.post_status
        || (legacyStatus === 'failed' ? 'failed' : null)
        || (legacyStatus === 'uploaded' ? 'success' : null)
        || 'idle';

    return {
        ...item,
        product_id: item.product_id || `PRD-${String(item.id).padStart(6, '0')}`,
        video_status: derivedVideoStatus,
        post_status: derivedPostStatus,
    };
};

export default function Index({ videos = [], channelOptions = [], kolOptions = [] }) {
    const { __ } = useI18n();
    const [items, setItems] = useState(() => videos.map(normalizeVideoItem));
    const [form, setForm] = useState(EMPTY_FORM);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');
    const [editingId, setEditingId] = useState(null);
    const [publishOpen, setPublishOpen] = useState(false);
    const [publishingVideo, setPublishingVideo] = useState(null);
    const [selectedChannelIds, setSelectedChannelIds] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notice, setNotice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [videoStatusFilter, setVideoStatusFilter] = useState('all');
    const [postStatusFilter, setPostStatusFilter] = useState('all');

    const activeChannels = useMemo(
        () => channelOptions.filter((channel) => channel.status === 'active'),
        [channelOptions],
    );

    const filteredItems = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return items.filter((item) => {
            const productId = (item.product_id || `PRD-${String(item.id).padStart(6, '0')}`).toLowerCase();
            const productName = (item.product_name || '').toLowerCase();
            const matchesQuery = !query || productId.includes(query) || productName.includes(query);
            const matchesVideoStatus = videoStatusFilter === 'all' || item.video_status === videoStatusFilter;
            const matchesPostStatus = postStatusFilter === 'all' || item.post_status === postStatusFilter;

            return matchesQuery && matchesVideoStatus && matchesPostStatus;
        });
    }, [items, searchTerm, videoStatusFilter, postStatusFilter]);

    const isEditing = dialogMode === 'edit' && editingId !== null;

    const closeDialog = () => {
        setDialogOpen(false);
        setDialogMode('add');
        setEditingId(null);
        setForm(EMPTY_FORM);
    };

    const openAddDialog = () => {
        setDialogMode('add');
        setEditingId(null);
        setForm({ ...EMPTY_FORM, product_photo_file: null, video_files: [] });
        setDialogOpen(true);
    };

    const openEditDialog = (item) => {
        setDialogMode('edit');
        setEditingId(item.id);
        setForm({
            product_name: item.product_name || '',
            product_photo_file: null,
            product_photo_url: item.product_photo_url || '',
            product_description: item.product_description || '',
            kol_name: item.kol_name || '',
            video_files: [],
            video_count: 1,
            video_url: item.video_url || '',
        });
        setDialogOpen(true);
    };

    const updateForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                updateForm('product_photo_url', event.target?.result);
            };
            reader.readAsDataURL(file);
            updateForm('product_photo_file', file);
        }
    };

    const handleVideoSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) {
            return;
        }

        if (files.length > 10) {
            setNotice({ type: 'error', message: __('You can only select up to 10 videos.') });
            return;
        }

        updateForm('video_files', files);
        updateForm('video_count', files.length);
        updateForm('video_url', files[0]?.name || '');
    };

    const queuePendingToNotUploaded = (videoIds) => {
        const targetIds = Array.isArray(videoIds) ? videoIds : [videoIds];

        window.setTimeout(() => {
            setItems((prev) => prev.map((item) => (
                targetIds.includes(item.id) && item.video_status === 'pending'
                    ? { ...item, video_status: 'not_uploaded' }
                    : item
            )));
        }, 5000);
    };

    const saveVideo = (e) => {
        e.preventDefault();

        if (!form.product_name.trim() || !form.product_description.trim()) {
            setNotice({ type: 'error', message: __('Please fill in Product Name and Product Description.') });
            return;
        }

        const selectedFiles = form.video_files || [];
        const uploadedFromComputer = selectedFiles.length > 0;
        const requestedCount = Math.max(1, Math.min(10, Number(form.video_count) || 1));

        if (isEditing) {
            if (selectedFiles.length > 1) {
                setNotice({ type: 'error', message: __('Edit mode only supports one uploaded video file.') });
                return;
            }

            setItems((prev) => prev.map((item) => (
                item.id === editingId
                    ? {
                        ...item,
                        product_name: form.product_name.trim(),
                        product_photo_url: form.product_photo_url.trim() || null,
                        product_description: form.product_description.trim(),
                        kol_name: form.kol_name || null,
                        kol_image_url: form.kol_name ? getKolImageByName(form.kol_name) : null,
                        video_url: uploadedFromComputer ? selectedFiles[0].name : item.video_url,
                        video_status: uploadedFromComputer ? 'uploaded' : item.video_status,
                        post_status: item.post_status || 'idle',
                    }
                    : item
            )));

            setNotice({ type: 'success', message: uploadedFromComputer ? __('Uploaded video has been updated.') : __('Video details have been updated.') });
            closeDialog();
            return;
        }

        const productSeed = Date.now();
        const generatedProductId = `PRD-${String(productSeed).slice(-8)}`;
        const baseItem = {
            product_id: generatedProductId,
            product_name: form.product_name.trim(),
            product_photo_url: form.product_photo_url.trim() || null,
            product_description: form.product_description.trim(),
            kol_name: form.kol_name || null,
            kol_image_url: form.kol_name ? getKolImageByName(form.kol_name) : null,
            post_status: 'idle',
            is_new: true,
        };

        const createdItems = uploadedFromComputer
            ? selectedFiles.map((file, index) => normalizeVideoItem({
                ...baseItem,
                id: productSeed + index,
                video_url: file.name,
                video_status: 'uploaded',
            }))
            : Array.from({ length: requestedCount }, (_, index) => normalizeVideoItem({
                ...baseItem,
                id: productSeed + index,
                video_url: '',
                video_status: 'pending',
            }));

        setItems((prev) => [...createdItems, ...prev]);

        if (!uploadedFromComputer) {
            queuePendingToNotUploaded(createdItems.map((item) => item.id));
        }

        setNotice({
            type: 'success',
            message: uploadedFromComputer
                ? __('Videos have been added with uploaded sources.')
                : __('Video requests created. Status is pending while auto-generation runs in background.'),
        });
        closeDialog();
    };

    const deleteVideo = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setNotice({ type: 'success', message: __('Video has been deleted.') });
    };

    const openPublishDialog = (video) => {
        setPublishingVideo(video);
        setSelectedChannelIds([]);
        setPublishOpen(true);
    };

    const closePublishDialog = () => {
        setPublishOpen(false);
        setPublishingVideo(null);
        setSelectedChannelIds([]);
        setIsSubmitting(false);
    };

    const toggleChannelSelection = (id) => {
        setSelectedChannelIds((prev) => (
            prev.includes(id)
                ? prev.filter((channelId) => channelId !== id)
                : [...prev, id]
        ));
    };

    const submitPublish = () => {
        if (!publishingVideo) {
            return;
        }

        if (publishingVideo.video_status === 'uploaded' && publishingVideo.post_status === 'success') {
            setNotice({ type: 'error', message: __('This uploaded video has already been posted successfully.') });
            return;
        }

        if (selectedChannelIds.length === 0) {
            setNotice({ type: 'error', message: __('Please select at least one channel.') });
            return;
        }

        setIsSubmitting(true);
        axios
            .post(`/videos/${publishingVideo.id}/publish`, { social_account_ids: selectedChannelIds })
            .then((response) => {
                setItems((prev) => prev.map((item) => (
                    item.id === publishingVideo.id
                        ? { ...item, post_status: 'success' }
                        : item
                )));
                setNotice({ type: 'success', message: response.data?.message || __('Post job created') });
                closePublishDialog();
            })
            .catch(() => {
                setItems((prev) => prev.map((item) => (
                    item.id === publishingVideo.id
                        ? { ...item, post_status: 'failed' }
                        : item
                )));
                setNotice({ type: 'error', message: __('Could not create publish job. Please try again.') });
                setIsSubmitting(false);
            });
    };

    const channelLabel = (channel) => `[${channel.platform}] ${channel.channel_name}`;
    const getKolImageByName = (kolName) => kolOptions.find((kol) => kol.name === kolName)?.image_url || null;
    const getVideoStatusBadge = (status) => {
        if (status === 'pending') {
            return { label: 'pending', className: 'border-sky-300 bg-sky-50 text-sky-700' };
        }

        if (status === 'uploaded') {
            return { label: 'uploaded', className: 'border-emerald-300 bg-emerald-50 text-emerald-700' };
        }

        return { label: 'not uploaded', className: 'border-amber-300 bg-amber-50 text-amber-700' };
    };

    const getPostStatusBadge = (status) => {
        if (status === 'success') {
            return { label: 'success', className: 'border-emerald-300 bg-emerald-50 text-emerald-700' };
        }

        if (status === 'failed') {
            return { label: 'failed', className: 'border-rose-300 bg-rose-50 text-rose-700' };
        }

        return { label: 'idle', className: 'border-slate-300 bg-slate-50 text-slate-700' };
    };

    return (
        <AppLayout title="Videos">
            <Head title={__('Videos')} />

            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-emerald-700">
                        {__('Videos')}
                    </h2>
                    <p className="text-slate-600 mt-1">
                        {__('Manage completed videos and post them to your existing social channels.')}
                    </p>
                </div>

                {notice && (
                    <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${notice.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                        {notice.message}
                    </div>
                )}

                <div className="flex justify-end">
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                            <div className="relative w-full sm:max-w-sm">
                                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={__('Search by product name or ID')}
                                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <select
                                value={videoStatusFilter}
                                onChange={(e) => setVideoStatusFilter(e.target.value)}
                                className="w-full lg:w-44 rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="all">{__('All video status')}</option>
                                <option value="pending">{__('Pending')}</option>
                                <option value="not_uploaded">{__('Not uploaded')}</option>
                                <option value="uploaded">{__('Uploaded')}</option>
                            </select>

                            <select
                                value={postStatusFilter}
                                onChange={(e) => setPostStatusFilter(e.target.value)}
                                className="w-full lg:w-40 rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="all">{__('All post status')}</option>
                                <option value="idle">{__('Idle')}</option>
                                <option value="success">{__('Success')}</option>
                                <option value="failed">{__('Failed')}</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={openAddDialog}
                            className="inline-flex min-w-[190px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-emerald-600 text-white font-semibold px-5 py-2 hover:bg-emerald-700"
                        >
                            <Plus size={16} />
                            {__('Add New Video')}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-100 overflow-hidden">
                    <div className="px-4 py-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">{__('Videos List')}</h3>
                    </div>

                    <table className="w-full table-fixed text-sm">
                        <thead className="bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-50 border-b border-slate-200">
                            <tr>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700 whitespace-nowrap w-10">#</th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700 whitespace-nowrap w-24">{__('Product ID')}</th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700">{__('Product Name')}</th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700 whitespace-nowrap w-24">{__('Product Photo')}</th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700 hidden md:table-cell">{__('Product Description')}</th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700 whitespace-nowrap w-24">{__('KOL Name')}</th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700 whitespace-nowrap w-24 hidden lg:table-cell">{__('KOL Image')}</th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700 whitespace-nowrap w-28">{__('Video URL')}</th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700 whitespace-nowrap w-28">
                                    <span className="inline-flex items-center justify-center gap-1">
                                        {__('Video Status')}
                                        <span
                                            className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-500 cursor-help"
                                            title="Pending: system is generating video. Not uploaded: video is ready but not uploaded yet. Uploaded: video has been uploaded."
                                            aria-label="Pending: system is generating video. Not uploaded: video is ready but not uploaded yet. Uploaded: video has been uploaded."
                                        >
                                            i
                                        </span>
                                    </span>
                                </th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700 whitespace-nowrap w-24">
                                    <span className="inline-flex items-center justify-center gap-1">
                                        {__('Post Status')}
                                        <span
                                            className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-500 cursor-help"
                                            title="Idle: not posted yet. Success: post request completed successfully. Failed: post request failed."
                                            aria-label="Idle: not posted yet. Success: post request completed successfully. Failed: post request failed."
                                        >
                                            i
                                        </span>
                                    </span>
                                </th>
                                <th className="text-center py-3 px-3 font-semibold text-gray-700 whitespace-nowrap w-28">{__('Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item, index) => (
                                <tr key={item.id} className="border-b border-slate-100 hover:bg-sky-50/40 transition-colors align-top">
                                    <td className="py-3 px-3 text-slate-500 font-semibold whitespace-nowrap">
                                        <div className="inline-flex items-center gap-2">
                                            {item.is_new && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                                            <span>{index + 1}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 font-medium text-slate-700 whitespace-normal break-all leading-tight">
                                        {item.product_id || `PRD-${String(item.id).padStart(6, '0')}`}
                                    </td>
                                    <td className="py-3 px-3 font-semibold text-slate-900 whitespace-normal break-words leading-snug">
                                        {item.product_name}
                                    </td>
                                    <td className="py-3 px-3 whitespace-nowrap">
                                        {item.product_photo_url ? (
                                            <img
                                                src={item.product_photo_url}
                                                alt={item.product_name}
                                                className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                                            />
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 bg-slate-50">
                                                <ImageOff size={12} />
                                                {__('No image')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-3 hidden md:table-cell">
                                        <p className="text-slate-700 whitespace-normal break-words">{item.product_description}</p>
                                    </td>
                                    <td className="py-3 px-3 whitespace-normal">
                                        <span className="inline-flex px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                                            {item.kol_name || 'None'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 whitespace-nowrap hidden lg:table-cell">
                                        {item.kol_name && item.kol_image_url ? (
                                            <img
                                                src={item.kol_image_url}
                                                alt={item.kol_name}
                                                className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                                            />
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 bg-slate-50">
                                                <ImageOff size={12} />
                                                {__('No image')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-3 whitespace-normal">
                                        {item.video_status === 'pending' ? (
                                            <span className="inline-flex items-center gap-1 rounded-lg border border-sky-200 px-2 py-1 text-xs text-sky-700 bg-sky-50">
                                                {__('Processing')}
                                            </span>
                                        ) : item.video_url ? (
                                            <a
                                                href={item.video_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 hover:underline"
                                            >
                                                {__('Open video')}
                                                <ExternalLink size={13} />
                                            </a>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-2 py-1 text-xs text-amber-700 bg-amber-50">
                                                {__('Not uploaded yet')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-3 whitespace-normal">
                                        {(() => {
                                            const status = getVideoStatusBadge(item.video_status);

                                            return (
                                                <span className={`inline-flex px-2.5 py-1 rounded-full border capitalize ${status.className}`}>
                                                    {status.label}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="py-3 px-3 whitespace-normal">
                                        {(() => {
                                            const status = getPostStatusBadge(item.post_status);

                                            return (
                                                <span className={`inline-flex px-2.5 py-1 rounded-full border capitalize ${status.className}`}>
                                                    {status.label}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="py-3 px-3 whitespace-normal">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openPublishDialog(item)}
                                                disabled={item.video_status === 'uploaded' && item.post_status === 'success'}
                                                className="inline-flex w-full lg:w-auto items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                                            >
                                                <Send size={14} />
                                                {__('Post')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteVideo(item.id)}
                                                className="inline-flex w-full lg:w-auto items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                                            >
                                                <Trash2 size={14} />
                                                {__('Delete')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {dialogOpen && typeof document !== 'undefined' && createPortal(
                    <div className="fixed inset-0 z-[100]">
                        <div className="absolute inset-0 bg-black/30" onClick={closeDialog} />
                        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                            <div className="relative z-[101] w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-emerald-200/80 bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)]">
                                <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-50 border-b border-sky-100 rounded-t-3xl">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {isEditing ? __('Edit video') : __('Add new video')}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={closeDialog}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-white hover:text-slate-700"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form onSubmit={saveVideo} className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
                                        <p className="text-sm font-semibold text-gray-700">
                                            {__('Product Name')}
                                            <span className="ml-1 text-rose-500">*</span>
                                        </p>
                                        <input
                                            type="text"
                                            value={form.product_name}
                                            onChange={(e) => updateForm('product_name', e.target.value)}
                                            className="md:col-span-2 rounded-xl border-gray-300 focus:ring-sky-500 focus:border-sky-500"
                                            placeholder={__('Product Name')}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
                                        <p className="text-sm font-semibold text-gray-700">
                                            {__('Product Photo')}
                                            <span className="ml-1 text-rose-500">*</span>
                                        </p>
                                        <div className="md:col-span-2 flex items-center gap-3 flex-wrap">
                                            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 cursor-pointer text-sm font-semibold transition-colors shadow-sm">
                                                <ImagePlus size={16} />
                                                {__('Choose image')}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageSelect}
                                                    className="hidden"
                                                />
                                            </label>

                                            <div className="flex items-center gap-2 min-w-0">
                                                {form.product_photo_url ? (
                                                    <img
                                                        src={form.product_photo_url}
                                                        alt="preview"
                                                        className="h-10 w-10 rounded-lg border border-slate-200 object-cover shrink-0"
                                                    />
                                                ) : (
                                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 shrink-0">
                                                        <FileImage size={16} />
                                                    </span>
                                                )}

                                                <span className="text-sm text-slate-600 truncate max-w-[260px]">
                                                    {form.product_photo_file ? form.product_photo_file.name : 'No image selected'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-3">
                                        <p className="text-sm font-semibold text-gray-700 mt-2">
                                            {__('Product Description')}
                                            <span className="ml-1 text-rose-500">*</span>
                                        </p>
                                        <textarea
                                            rows={3}
                                            value={form.product_description}
                                            onChange={(e) => updateForm('product_description', e.target.value)}
                                            className="md:col-span-2 rounded-xl border-gray-300 focus:ring-sky-500 focus:border-sky-500"
                                            placeholder={__('Product Description')}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-3">
                                        <p className={`text-sm font-semibold mt-2 ${form.video_files?.length ? 'text-slate-400' : 'text-gray-700'}`}>{__('KOL')}</p>
                                        <div className={`md:col-span-2 space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-2 ${form.video_files?.length ? 'bg-slate-100 opacity-50 pointer-events-none' : 'bg-slate-50'}`}>
                                            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="kol_select"
                                                    value=""
                                                    checked={form.kol_name === ''}
                                                    onChange={(e) => updateForm('kol_name', e.target.value)}
                                                    disabled={!!form.video_files?.length}
                                                    className="rounded border-slate-300"
                                                />
                                                <span className="text-sm font-medium text-slate-700">None</span>
                                            </label>
                                            {kolOptions.map((kol) => (
                                                <label key={kol.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="kol_select"
                                                        value={kol.name}
                                                        checked={form.kol_name === kol.name}
                                                        onChange={(e) => updateForm('kol_name', e.target.value)}
                                                        disabled={!!form.video_files?.length}
                                                        className="rounded border-slate-300"
                                                    />
                                                    <img
                                                        src={kol.image_url}
                                                        alt={kol.name}
                                                        className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                                                    />
                                                    <span className="text-sm font-medium text-slate-700">{kol.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
                                        <p className="text-sm font-semibold text-gray-700">
                                            {__('Number of videos')}
                                            <span className="ml-1 text-rose-500">*</span>
                                        </p>
                                        <div className="md:col-span-2 flex items-center gap-3 flex-wrap">
                                            <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => updateForm('video_count', Math.max(1, Number(form.video_count || 1) - 1))}
                                                    disabled={!!form.video_files?.length || form.video_count <= 1}
                                                    className="h-11 w-11 text-lg font-semibold text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                                                    aria-label="Decrease video count"
                                                >
                                                    -
                                                </button>
                                                <div className="flex h-11 min-w-14 items-center justify-center border-x border-slate-200 px-4 font-semibold text-slate-800 bg-white">
                                                    {form.video_count}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => updateForm('video_count', Math.min(10, Number(form.video_count || 1) + 1))}
                                                    disabled={!!form.video_files?.length || form.video_count >= 10}
                                                    className="h-11 w-11 text-lg font-semibold text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                                                    aria-label="Increase video count"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                {form.video_files?.length
                                                    ? __('Locked to selected files count.')
                                                    : __('Choose how many videos to auto-generate (1-10).')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="sticky bottom-0 bg-white pt-4 pb-1 flex justify-between items-end gap-3 border-t border-slate-100">
                                        <div className="flex flex-col items-start gap-1 max-w-sm">
                                            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-sky-300 text-sky-700 hover:bg-sky-50 cursor-pointer text-sm font-medium bg-sky-100 transition-colors">
                                                <Upload size={16} />
                                                {__('Choose video')}
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    multiple
                                                    onChange={handleVideoSelect}
                                                    className="hidden"
                                                />
                                                {!!form.video_files?.length && <Check size={14} className="ml-1 text-green-600" />}
                                            </label>
                                            {!!form.video_files?.length && (
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    {form.video_files.length} {__('video file(s) selected')}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                Optional: choose 1-10 existing advertising videos from your computer.
                                            </p>
                                        </div>
                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-5 py-2.5 hover:from-emerald-700 hover:to-teal-700"
                                        >
                                            <Video size={16} />
                                            {isEditing ? __('Save video') : __('Create video')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}

                {publishOpen && publishingVideo && typeof document !== 'undefined' && createPortal(
                    <div className="fixed inset-0 z-[110]">
                        <div className="absolute inset-0 bg-black/30" onClick={closePublishDialog} />
                        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                            <div className="relative z-[111] w-full max-w-2xl rounded-3xl border border-emerald-200/80 bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)]">
                                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100 rounded-t-3xl">
                                    <h3 className="text-xl font-bold text-slate-900">{__('Post Video to Existing Channel')}</h3>
                                    <button
                                        type="button"
                                        onClick={closePublishDialog}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-white hover:text-slate-700"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                                        <p className="font-semibold text-slate-800">{publishingVideo.product_name}</p>
                                        <a
                                            href={publishingVideo.video_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 mt-1 text-sky-700 hover:text-sky-900 hover:underline"
                                        >
                                            {__('Open video')}
                                            <ExternalLink size={13} />
                                        </a>
                                    </div>

                                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                        {activeChannels.length === 0 ? (
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                                <p>{__('No channels available')}</p>
                                                <a href="/channels" className="inline-block mt-2 text-emerald-700 hover:underline">
                                                    {__('Go to Channels')}
                                                </a>
                                            </div>
                                        ) : (
                                            activeChannels.map((channel) => (
                                                <label
                                                    key={channel.id}
                                                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-emerald-50/40 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedChannelIds.includes(channel.id)}
                                                        onChange={() => toggleChannelSelection(channel.id)}
                                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <span className="text-sm font-medium text-slate-800">{channelLabel(channel)}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={submitPublish}
                                            disabled={isSubmitting || activeChannels.length === 0}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-5 py-2.5 shadow-lg shadow-emerald-300/60 hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-300 disabled:to-emerald-300"
                                        >
                                            <Send size={16} />
                                            {isSubmitting ? __('Posting...') : __('Post Now')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
            </div>
        </AppLayout>
    );
}
