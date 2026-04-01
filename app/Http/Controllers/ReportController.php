<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Display a listing of reports.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Reports/Index');
    }
}
