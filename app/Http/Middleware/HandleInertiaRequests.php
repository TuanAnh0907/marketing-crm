<?php

namespace App\Http\Middleware;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = app()->getLocale();

        $fallbackLocale = config('app.fallback_locale', 'en');
        $fallbackPath   = lang_path("$fallbackLocale.json");
        $currentPath    = lang_path("$locale.json");

        $fallbackTranslations = [];
        if (File::exists($fallbackPath)) {
            try {
                $content              = File::get($fallbackPath);
                $fallbackTranslations = json_decode($content, true) ?: [];
            } catch (Exception $e) {
                Log::error("Failed to load fallback translations for $fallbackLocale: ".$e->getMessage());
            }
        }

        $currentTranslations = [];
        if ($locale !== $fallbackLocale && File::exists($currentPath)) {
            try {
                $content             = File::get($currentPath);
                $currentTranslations = json_decode($content, true) ?: [];
            } catch (Exception $e) {
                Log::error("Failed to load translations for $locale: ".$e->getMessage());
            }
        }

        $translations = array_merge($fallbackTranslations, $currentTranslations);

        return [
            ...parent::share($request),
            'auth'         => [
                'user' => $request->user(),
            ],
            'locale'       => $locale,
            'translations' => $translations,
        ];
    }
}
