<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display the user's profile settings.
     */
    public function profile(Request $request): Response
    {
        return Inertia::render('Settings/Profile');
    }

    /**
     * Display the user's security settings.
     */
    public function security(Request $request): Response
    {
        return Inertia::render('Settings/Security');
    }
}
