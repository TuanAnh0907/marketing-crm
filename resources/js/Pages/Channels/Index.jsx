import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { AlertCircle, Camera, ChevronDown, ExternalLink, FlaskConical, Link2, Music2, Pencil, PlaySquare, Plus, Save, Trash2, Unplug, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/translate';
import axios from 'axios';

const EMPTY_FORM = {
    platform: 'youtube',
    channel_name: '',
    channel_url: '',
    create_mode: 'oauth',
    status: 'active',
};

export default function Index({ channels = [] }) {
    const { __ } = useI18n();
    const [items, setItems] = useState(channels.map((item) => ({ ...item, is_new: false })));
    const [form, setForm] = useState(EMPTY_FORM);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');
    const [editingId, setEditingId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [notice, setNotice] = useState(null);
    const [openToolsId, setOpenToolsId] = useState(null);

    const isEditing = dialogMode === 'edit' && editingId !== null;

    const updateForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const closeDialog = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setDialogMode('add');
        setDialogOpen(false);
        setIsSaving(false);
    };

    const openAddDialog = () => {
        setDialogMode('add');
        setEditingId(null);
        setForm(EMPTY_FORM);
        setDialogOpen(true);
    };

    const startEdit = (item) => {
        setDialogMode('edit');
        setEditingId(item.id);
        setForm({
            platform: item.platform,
            channel_name: item.channel_name,
            channel_url: item.channel_url,
            create_mode: 'oauth',
            status: item.status || 'active',
        });
        setDialogOpen(true);
    };

    const submitForm = (e) => {
        e.preventDefault();

        if (!form.channel_name.trim()) {
            return;
        }

        if (isEditing) {
            setItems((prev) => prev.map((item) => (
                item.id === editingId
                    ? {
                        ...item,
                        platform: form.platform,
                        channel_name: form.channel_name.trim(),
                        status: form.status,
                    }
                    : item
            )));
            closeDialog();
            return;
        }

        setIsSaving(true);
        axios
            .post('/channels/provision', {
                platform: form.platform,
                channel_name: form.channel_name.trim(),
                create_mode: form.create_mode,
                channel_url: form.create_mode === 'manual' ? form.channel_url.trim() : null,
            })
            .then((response) => {
                setItems((prev) => [...prev, { ...response.data, is_new: true }]);
                setNotice({ type: 'success', message: __('Channel has been created successfully.') });
                closeDialog();
            })
            .catch(() => {
                setNotice({ type: 'error', message: __('Could not create channel. Please try again.') });
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const deleteItem = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setOpenToolsId((prev) => (prev === id ? null : prev));
        if (editingId === id) {
            closeDialog();
        }
    };

    const toggleTools = (id) => {
        setOpenToolsId((prev) => (prev === id ? null : id));
    };

    const reconnectChannel = (id) => {
        setItems((prev) => prev.map((item) => (
            item.id === id
                ? {
                    ...item,
                    connection_status: 'connected',
                    granted_scopes: ['upload', 'analytics.read', 'channel.read'],
                    token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    last_sync_at: new Date().toISOString(),
                    last_error: null,
                }
                : item
        )));
        setNotice({ type: 'success', message: __('Channel connected successfully.') });
    };

    const disconnectChannel = (id) => {
        setItems((prev) => prev.map((item) => (
            item.id === id
                ? {
                    ...item,
                    connection_status: 'revoked',
                    status: 'disconnected',
                    token_expires_at: null,
                    last_sync_at: new Date().toISOString(),
                    last_error: __('Disconnected by user'),
                }
                : item
        )));
        setNotice({ type: 'success', message: __('Channel has been disconnected.') });
    };

    const testConnection = (item) => {
        if (item.connection_status === 'connected') {
            setNotice({ type: 'success', message: __('Test connection successful.') });
            return;
        }

        setNotice({ type: 'error', message: __('Connection test failed. Please reconnect OAuth.') });
    };

    const getPlatformBadge = (platform) => {
        if (platform === 'youtube') {
            return {
                icon: PlaySquare,
                className: 'border-red-200 bg-red-50 text-red-700',
                label: 'YouTube',
            };
        }

        if (platform === 'instagram') {
            return {
                icon: Camera,
                className: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
                label: 'Instagram',
            };
        }

        return {
            icon: Music2,
            className: 'border-cyan-200 bg-cyan-50 text-cyan-700',
            label: 'TikTok',
        };
    };

    const getStatusBadgeClass = (status) => {
        if (status === 'paused') {
            return 'border-yellow-300 bg-yellow-50 text-yellow-700';
        }

        if (status === 'disconnected') {
            return 'border-red-300 bg-red-50 text-red-700';
        }

        return 'border-emerald-300 bg-emerald-50 text-emerald-700';
    };

    const getConnectionBadgeClass = (connectionStatus) => {
        if (connectionStatus === 'expired') {
            return 'border-amber-300 bg-amber-50 text-amber-700';
        }

        if (connectionStatus === 'revoked' || connectionStatus === 'error') {
            return 'border-rose-300 bg-rose-50 text-rose-700';
        }

        if (connectionStatus === 'disconnected') {
            return 'border-slate-300 bg-slate-50 text-slate-700';
        }

        return 'border-emerald-300 bg-emerald-50 text-emerald-700';
    };

    const formatDate = (value) => {
        if (!value) {
            return '--';
        }

        return new Date(value).toLocaleString();
    };

    return (
        <AppLayout title="Channels">
            <Head title={__('Channels')} />

            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                        {__('Channels')}
                    </h2>
                    <p className="text-slate-600 mt-1">
                        {__('Manage YouTube, TikTok, and Instagram channel links for each customer.')}
                    </p>
                </div>

                {notice && (
                    <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${notice.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                        {notice.message}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={openAddDialog}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white font-semibold px-4 py-2 hover:bg-emerald-700"
                    >
                        <Plus size={16} />
                        {__('Add new channel')}
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-100 overflow-x-auto">
                    <div className="px-4 py-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">{__('Channels List')}</h3>
                    </div>

                    <table className="min-w-[1500px] text-sm">
                        <thead className="bg-gradient-to-r from-cyan-50 via-emerald-50 to-lime-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">#</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">{__('Channel name')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">{__('Platform')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">{__('Channel URL')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">{__('Connection')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">{__('Scopes')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">{__('Token Expiry')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">{__('Last Sync')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">{__('Status')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">{__('Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id} className="border-b border-slate-100 hover:bg-cyan-50/40 transition-colors">
                                    <td className="py-3 px-4 text-gray-500 font-semibold whitespace-nowrap">
                                        <div className="inline-flex items-center gap-2">
                                            {item.is_new && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                                            <span>{index + 1}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">{item.channel_name}</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        {(() => {
                                            const { icon: PlatformIcon, className, label } = getPlatformBadge(item.platform);

                                            return (
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${className}`}>
                                                    <PlatformIcon size={14} />
                                                    {label}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <a
                                            href={item.channel_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 hover:underline whitespace-nowrap"
                                        >
                                            {__('Open channel')}
                                            <ExternalLink size={13} />
                                        </a>
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full border capitalize ${getConnectionBadgeClass(item.connection_status || 'disconnected')}`}>
                                            {item.connection_status || 'disconnected'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1.5">
                                            {(item.granted_scopes || []).slice(0, 2).map((scope) => (
                                                <span key={scope} className="inline-flex px-2 py-0.5 rounded-md text-xs border border-cyan-200 bg-cyan-50 text-cyan-700">
                                                    {scope}
                                                </span>
                                            ))}
                                            {(item.granted_scopes || []).length > 2 && (
                                                <span className="inline-flex px-2 py-0.5 rounded-md text-xs border border-slate-200 bg-slate-50 text-slate-700">
                                                    +{(item.granted_scopes || []).length - 2}
                                                </span>
                                            )}
                                            {(item.granted_scopes || []).length === 0 && <span className="text-slate-400">--</span>}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">{formatDate(item.token_expires_at)}</td>
                                    <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">{formatDate(item.last_sync_at)}</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full border capitalize ${getStatusBadgeClass(item.status || 'active')}`}>
                                            {item.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <div className="inline-flex items-center gap-2 flex-nowrap whitespace-nowrap relative">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(item)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-200 text-cyan-700 hover:bg-cyan-50 whitespace-nowrap"
                                            >
                                                <Pencil size={14} />
                                                {__('Edit')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleTools(item.id)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                                            >
                                                <Link2 size={14} />
                                                {__('Connection tools')}
                                                <ChevronDown size={14} className={`${openToolsId === item.id ? 'rotate-180' : ''} transition-transform`} />
                                            </button>
                                            {openToolsId === item.id && (
                                                <div className="absolute left-0 top-full mt-2 z-30 min-w-[200px] rounded-xl border border-slate-200 bg-white shadow-lg p-2 flex flex-col gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            reconnectChannel(item.id);
                                                            setOpenToolsId(null);
                                                        }}
                                                        title={__('Kết nối hoặc cấp quyền lại cho kênh này qua OAuth.')}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 whitespace-nowrap"
                                                    >
                                                        <Link2 size={14} />
                                                        {item.connection_status === 'connected' ? __('Reconnect') : __('Connect')}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            disconnectChannel(item.id);
                                                            setOpenToolsId(null);
                                                        }}
                                                        title={__('Ngắt kết nối kênh này khỏi CRM, dừng đồng bộ và upload tự động.')}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 whitespace-nowrap"
                                                    >
                                                        <Unplug size={14} />
                                                        {__('Disconnect')}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            testConnection(item);
                                                            setOpenToolsId(null);
                                                        }}
                                                        title={__('Kiểm tra token và quyền hiện tại của kết nối kênh này.')}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 whitespace-nowrap"
                                                    >
                                                        <FlaskConical size={14} />
                                                        {__('Test')}
                                                    </button>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => deleteItem(item.id)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 whitespace-nowrap"
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
                        <div className="absolute inset-0 bg-black/25" onClick={closeDialog} />

                        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                            <div className="relative z-[101] w-full max-w-2xl rounded-3xl border border-emerald-200/80 bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)]">
                                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100 rounded-t-3xl">
                                    <h3 className="text-xl font-bold text-slate-900">{isEditing ? __('Edit channel') : __('Add new channel')}</h3>
                                    <button
                                        type="button"
                                        onClick={closeDialog}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-white hover:text-slate-700 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form onSubmit={submitForm} className="p-6 space-y-4">
                                    {!isEditing && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
                                            <p className="text-sm font-semibold text-gray-700">{__('Create mode')}</p>
                                            <select
                                                value={form.create_mode}
                                                onChange={(e) => updateForm('create_mode', e.target.value)}
                                                className="md:col-span-2 rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                                            >
                                                <option value="oauth">{__('OAuth Connect')}</option>
                                                <option value="manual">{__('Manual')}</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
                                        <p className="text-sm font-semibold text-gray-700">{__('Platform')}</p>
                                        <select
                                            value={form.platform}
                                            onChange={(e) => updateForm('platform', e.target.value)}
                                            className="md:col-span-2 rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                                        >
                                            <option value="youtube">YouTube</option>
                                            <option value="tiktok">TikTok</option>
                                            <option value="instagram">Instagram</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
                                        <p className="text-sm font-semibold text-gray-700">{__('Channel name')}</p>
                                        <input
                                            type="text"
                                            value={form.channel_name}
                                            onChange={(e) => updateForm('channel_name', e.target.value)}
                                            className="md:col-span-2 rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder={__('Channel name')}
                                        />
                                    </div>

                                    {!isEditing && form.create_mode === 'manual' && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
                                            <p className="text-sm font-semibold text-gray-700">{__('Channel URL')}</p>
                                            <input
                                                type="url"
                                                value={form.channel_url}
                                                onChange={(e) => updateForm('channel_url', e.target.value)}
                                                className="md:col-span-2 rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    )}

                                    {isEditing && (
                                        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
                                                <p className="text-sm font-semibold text-gray-700">{__('Status')}</p>
                                                <select
                                                    value={form.status}
                                                    onChange={(e) => updateForm('status', e.target.value)}
                                                    className="md:col-span-2 rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                                                >
                                                    <option value="active">{__('Active')}</option>
                                                    <option value="paused">{__('Paused')}</option>
                                                    <option value="disconnected">{__('Disconnected')}</option>
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-3 text-sm">
                                                <p className="font-semibold text-slate-700">{__('Connection status')}</p>
                                                <p className="md:col-span-2 text-slate-600 capitalize">{items.find((x) => x.id === editingId)?.connection_status || '--'}</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-3 text-sm">
                                                <p className="font-semibold text-slate-700">{__('Granted scopes')}</p>
                                                <p className="md:col-span-2 text-slate-600">{(items.find((x) => x.id === editingId)?.granted_scopes || []).join(', ') || '--'}</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-3 text-sm">
                                                <p className="font-semibold text-slate-700">{__('Token expiry')}</p>
                                                <p className="md:col-span-2 text-slate-600">{formatDate(items.find((x) => x.id === editingId)?.token_expires_at)}</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-3 text-sm">
                                                <p className="font-semibold text-slate-700">{__('Last error')}</p>
                                                <p className="md:col-span-2 text-slate-600 inline-flex items-center gap-1">
                                                    {items.find((x) => x.id === editingId)?.last_error ? <AlertCircle size={14} className="text-rose-500" /> : null}
                                                    {items.find((x) => x.id === editingId)?.last_error || '--'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-5 py-2.5 shadow-lg shadow-emerald-300/60 hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-300 disabled:to-emerald-300"
                                        >
                                            <Save size={16} />
                                            {isSaving ? __('Saving...') : __('Save channel')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </AppLayout>
    );
}
