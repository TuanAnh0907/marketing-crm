<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    /**
     * Display a listing of campaigns.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Campaigns/Index');
    }

    /**
     * Show the form for creating a new campaign.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Campaigns/Create');
    }
}
