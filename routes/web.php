<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Todo: Sau này cần sửa lại không trỏ trực tiếp vào login mà phải trả về một trang welcome để giới thiệu về ứng dụng, sau đó mới có nút đăng nhập
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/auth.php';
