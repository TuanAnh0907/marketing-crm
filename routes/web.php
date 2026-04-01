<?php

use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ChannelsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KolController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // Todo: Sau này cần sửa lại không trỏ trực tiếp vào login mà phải trả về một trang welcome để giới thiệu về ứng dụng
    return redirect()->route('login');
});

Route::get('/locale/{language}', function ($language) {
    if (in_array($language, ['en', 'vi'])) {
        session()->put('locale', $language);
    }
    return redirect()->back();
})->name('locale.switch');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/contacts', [ContactController::class, 'index'])
        ->name('contacts');

    Route::get('/campaigns', [CampaignController::class, 'index'])
        ->name('campaigns.index');
    Route::get('/campaigns/create', [CampaignController::class, 'create'])
        ->name('campaigns.create');

    Route::get('/reports', [ReportController::class, 'index'])
        ->name('reports');

    Route::get('/channels', [ChannelsController::class, 'index'])
        ->name('channels.index');
    Route::post('/channels/provision', [ChannelsController::class, 'provision'])
        ->name('channels.provision');

    Route::get('/kols', [KolController::class, 'index'])
        ->name('kols.index');
    Route::get('/kols/{slug}', [KolController::class, 'show'])
        ->name('kols.show');

    Route::get('/settings/profile', [SettingController::class, 'profile'])
        ->name('settings.profile');
    Route::get('/settings/security', [SettingController::class, 'security'])
        ->name('settings.security');
});

require __DIR__.'/auth.php';
