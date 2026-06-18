<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $todayStart = $now->copy()->startOfDay();
        $monthStart = $now->copy()->startOfMonth();

        $totalOrders = Order::count();
        $todayOrders = Order::where('created_at', '>=', $todayStart)->count();
        $monthOrders = Order::where('created_at', '>=', $monthStart)->count();

        $totalRevenue = Order::whereIn('status', ['paid', 'confirmed', 'preparing', 'ready', 'completed'])->sum('total');
        $todayRevenue = Order::whereIn('status', ['paid', 'confirmed', 'preparing', 'ready', 'completed'])
            ->where('created_at', '>=', $todayStart)->sum('total');
        $monthRevenue = Order::whereIn('status', ['paid', 'confirmed', 'preparing', 'ready', 'completed'])
            ->where('created_at', '>=', $monthStart)->sum('total');

        $pendingOrders = Order::whereIn('status', ['pending', 'paid'])->count();
        $preparingOrders = Order::where('status', 'preparing')->count();
        $readyOrders = Order::where('status', 'ready')->count();

        $totalMenuItems = MenuItem::count();
        $availableItems = MenuItem::where('is_available', true)->count();

        $ordersByStatus = Order::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $recentOrders = Order::with('items')
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'orders' => [
                    'total' => $totalOrders,
                    'today' => $todayOrders,
                    'this_month' => $monthOrders,
                ],
                'revenue' => [
                    'total' => round($totalRevenue, 2),
                    'today' => round($todayRevenue, 2),
                    'this_month' => round($monthRevenue, 2),
                ],
                'active_orders' => [
                    'pending' => $pendingOrders,
                    'preparing' => $preparingOrders,
                    'ready' => $readyOrders,
                ],
                'menu_items' => [
                    'total' => $totalMenuItems,
                    'available' => $availableItems,
                ],
                'orders_by_status' => $ordersByStatus,
                'recent_orders' => $recentOrders,
            ],
        ]);
    }
}
