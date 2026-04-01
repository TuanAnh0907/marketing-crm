<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ChannelsController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Channels/Index', [
            'channels' => [
                [
                    'id' => 1,
                    'platform' => 'youtube',
                    'channel_name' => 'MadeMeBuyIt Official',
                    'channel_url' => 'https://www.youtube.com/@mademebuyit',
                    'external_channel_id' => 'yt_9c13ab2',
                    'connection_status' => 'connected',
                    'granted_scopes' => ['upload', 'analytics.read', 'channel.read'],
                    'token_expires_at' => now()->addHours(18)->toIso8601String(),
                    'last_sync_at' => now()->subMinutes(35)->toIso8601String(),
                    'last_error' => null,
                    'status' => 'active',
                ],
                [
                    'id' => 2,
                    'platform' => 'tiktok',
                    'channel_name' => 'TikTok Made Me Buy It',
                    'channel_url' => 'https://www.tiktok.com/@tiktokmademebuyit1107',
                    'external_channel_id' => 'tt_61ff24e',
                    'connection_status' => 'expired',
                    'granted_scopes' => ['upload', 'channel.read'],
                    'token_expires_at' => now()->subHours(3)->toIso8601String(),
                    'last_sync_at' => now()->subHours(27)->toIso8601String(),
                    'last_error' => 'Access token expired',
                    'status' => 'active',
                ],
                [
                    'id' => 3,
                    'platform' => 'instagram',
                    'channel_name' => 'MMBI Studio',
                    'channel_url' => 'https://www.instagram.com/',
                    'external_channel_id' => 'ig_44a912a',
                    'connection_status' => 'revoked',
                    'granted_scopes' => ['channel.read'],
                    'token_expires_at' => null,
                    'last_sync_at' => now()->subDays(4)->toIso8601String(),
                    'last_error' => 'User revoked app permission',
                    'status' => 'paused',
                ],
            ],
        ]);
    }

    public function provision(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'platform' => ['required', 'in:youtube,tiktok,instagram'],
            'channel_name' => ['required', 'string', 'max:120'],
            'create_mode' => ['nullable', 'in:manual,oauth'],
            'channel_url' => ['nullable', 'url'],
        ]);

        $platform = $validated['platform'];
        $channelName = trim($validated['channel_name']);
        $slug = Str::slug($channelName);
        $createMode = $validated['create_mode'] ?? 'oauth';

        // MVP: simulate provider channel provisioning result.
        // Replace this block with real YouTube/TikTok/Instagram API calls in phase 2.
        $generatedUrl = match ($platform) {
            'youtube' => "https://www.youtube.com/@{$slug}",
            'tiktok' => "https://www.tiktok.com/@{$slug}",
            'instagram' => "https://www.instagram.com/{$slug}/",
        };

        $channelUrl = $createMode === 'manual'
            ? ($validated['channel_url'] ?? $generatedUrl)
            : $generatedUrl;

        return response()->json([
            'id' => random_int(1000, 9999),
            'platform' => $platform,
            'channel_name' => $channelName,
            'channel_url' => $channelUrl,
            'external_channel_id' => strtolower(substr($platform, 0, 2)).'_'.Str::lower(Str::random(7)),
            'connection_status' => $createMode === 'oauth' ? 'connected' : 'disconnected',
            'granted_scopes' => $createMode === 'oauth' ? ['upload', 'analytics.read', 'channel.read'] : [],
            'token_expires_at' => $createMode === 'oauth' ? now()->addHours(24)->toIso8601String() : null,
            'last_sync_at' => now()->toIso8601String(),
            'last_error' => null,
            'status' => 'active',
            'provisioned_at' => now()->toIso8601String(),
        ]);
    }
}
