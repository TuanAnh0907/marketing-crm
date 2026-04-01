<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard page.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                ['label' => 'Total Contacts', 'value' => '1,284', 'change' => '+12.5%', 'trendingUp' => true],
                ['label' => 'Active Campaigns', 'value' => '42', 'change' => '+3', 'trendingUp' => true],
                ['label' => 'Total Reports', 'value' => '156', 'change' => '-2', 'trendingUp' => false],
                ['label' => 'Growth', 'value' => '24.8%', 'change' => '+4.3%', 'trendingUp' => true],
            ],
            'recentActivity' => [
                ['id' => 1, 'type' => 'contact', 'user' => 'John Doe', 'action' => 'added a new contact', 'time' => '2 hours ago'],
                ['id' => 2, 'type' => 'campaign', 'user' => 'Jane Smith', 'action' => 'launched "Summer Sale"', 'time' => '4 hours ago'],
                ['id' => 3, 'type' => 'report', 'user' => 'Mike Johnson', 'action' => 'exported monthly report', 'time' => 'Yesterday'],
            ],
        ]);
    }
}
