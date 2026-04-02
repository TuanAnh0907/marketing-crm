<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Videos/Index', [
            'videos' => [
                [
                    'id' => 1,
                    'product_id' => 'PRD-LIP-001',
                    'product_name' => 'Son dưỡng môi Berry Glow',
                    'product_photo_url' => 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=320&q=80',
                    'product_description' => 'Son dưỡng có màu nhẹ, giữ ẩm 8 giờ cho môi khô nứt.',
                    'kol_name' => 'Kol 1',
                    'kol_image_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                    'video_url' => 'https://example.com/videos/berry-glow-review',
                    'publish_status' => 'uploaded',
                ],
                [
                    'id' => 2,
                    'product_id' => 'PRD-SER-015',
                    'product_name' => 'Serum Vitamin C 15%',
                    'product_photo_url' => 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=320&q=80',
                    'product_description' => 'Serum sáng da, hỗ trợ giảm thâm mờ xỉn chỉ sau 3 tuần.',
                    'kol_name' => null,
                    'kol_image_url' => null,
                    'video_url' => 'https://example.com/videos/vitamin-c-serum',
                    'publish_status' => 'not_uploaded',
                ],
                [
                    'id' => 3,
                    'product_id' => 'PRD-AUD-300',
                    'product_name' => 'Tai nghe Bluetooth AirBeat',
                    'product_photo_url' => null,
                    'product_description' => 'Tai nghe chống ồn chủ động, pin dùng liên tục đến 30 giờ.',
                    'kol_name' => 'Kol 2',
                    'kol_image_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
                    'video_url' => 'https://example.com/videos/airbeat-unbox',
                    'publish_status' => 'failed',
                ],
            ],
            'channelOptions' => [
                [
                    'id' => 1,
                    'platform' => 'youtube',
                    'channel_name' => 'MadeMeBuyIt Official',
                    'status' => 'active',
                ],
                [
                    'id' => 2,
                    'platform' => 'tiktok',
                    'channel_name' => 'TikTok Made Me Buy It',
                    'status' => 'active',
                ],
                [
                    'id' => 3,
                    'platform' => 'instagram',
                    'channel_name' => 'MMBI Studio',
                    'status' => 'paused',
                ],
            ],
            'kolOptions' => [
                [
                    'name' => 'Kol 1',
                    'image_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                ],
                [
                    'name' => 'Kol 2',
                    'image_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
                ],
                [
                    'name' => 'Kol 3',
                    'image_url' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
                ],
            ],
        ]);
    }

    public function publish(Request $request, int $video): JsonResponse
    {
        $validated = $request->validate([
            'social_account_ids' => ['required', 'array', 'min:1'],
            'social_account_ids.*' => ['integer'],
        ]);

        $jobs = collect($validated['social_account_ids'])
            ->map(fn (int $socialAccountId) => [
                'id' => random_int(10000, 99999),
                'content_item_id' => $video,
                'social_account_id' => $socialAccountId,
                'status' => 'pending',
            ])
            ->values()
            ->all();

        return response()->json([
            'message' => 'Post job created',
            'jobs' => $jobs,
        ]);
    }
}
