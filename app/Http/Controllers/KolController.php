<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KolController extends Controller
{
    private function kolDataset(): array
    {
        return [
            [
                'slug' => 'kol-1',
                'name' => 'Kol 1',
                'gender' => 'female',
                'apparent_age' => 'early-20s',
                'ethnicity' => 'vietnamese',
                'face_shape' => 'oval',
                'default_expression' => 'confident',
                'eye_type' => 'almond',
                'hair_style' => 'long-straight',
                'hair_color' => 'black',
                'skin_tone' => 'light-warm',
                'body_type' => 'slim',
                'image_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
                'tiktok_url' => 'https://www.tiktok.com/@tiktokmademebuyit1107',
            ],
            [
                'slug' => 'kol-2',
                'name' => 'Kol 2',
                'gender' => 'female',
                'apparent_age' => 'mid-20s',
                'ethnicity' => 'east-asian',
                'face_shape' => 'round',
                'default_expression' => 'confident',
                'eye_type' => 'sharp',
                'hair_style' => 'long-wavy',
                'hair_color' => 'light-brown',
                'skin_tone' => 'light',
                'body_type' => 'fit',
                'image_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
                'tiktok_url' => 'https://www.tiktok.com/',
            ],
            [
                'slug' => 'kol-3',
                'name' => 'Kol 3',
                'gender' => 'female',
                'apparent_age' => 'early-20s',
                'ethnicity' => 'korean-look',
                'face_shape' => 'v-line',
                'default_expression' => 'professional',
                'eye_type' => 'sharp',
                'hair_style' => 'shoulder-length',
                'hair_color' => 'ash-brown',
                'skin_tone' => 'light',
                'body_type' => 'slim',
                'image_url' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80',
                'tiktok_url' => 'https://www.tiktok.com/',
            ],
        ];
    }

    public function index(Request $request): Response
    {
        return Inertia::render('KOLs/Index', [
            'kols' => $this->kolDataset(),
        ]);
    }

    public function show(Request $request, string $slug): Response
    {
        $kol = collect($this->kolDataset())->firstWhere('slug', $slug);

        abort_if(!$kol, 404);

        return Inertia::render('KOLs/Show', [
            'kol' => $kol,
        ]);
    }
}
