<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Display a listing of contacts.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Contacts/Index');
    }
}
