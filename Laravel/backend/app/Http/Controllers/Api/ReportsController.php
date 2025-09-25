<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        // ✅ Lấy range từ query param (daily|weekly|monthly)
        $range = $request->query('range', 'daily');

        if ($range === 'weekly') {
            $start = Carbon::now('Asia/Ho_Chi_Minh')->startOfWeek();
            $end   = Carbon::now('Asia/Ho_Chi_Minh')->endOfWeek();
        } elseif ($range === 'monthly') {
            $start = Carbon::now('Asia/Ho_Chi_Minh')->startOfMonth();
            $end   = Carbon::now('Asia/Ho_Chi_Minh')->endOfMonth();
        } else {
            $start = Carbon::now('Asia/Ho_Chi_Minh')->startOfDay();
            $end   = Carbon::now('Asia/Ho_Chi_Minh')->endOfDay();
        }

        // --- LỌC ĐƠN THEO RANGE ---
        $ordersQuery = Order::whereIn('status', ['Fulfilled', 'Processing'])
            ->whereBetween('created_at', [$start, $end]);

        $totalRevenue = $ordersQuery->sum('total');
        $totalOrders = $ordersQuery->count();
        $avgOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        $newCustomers = User::where('role', 'Customer')
            ->whereBetween('created_at', [$start, $end])
            ->count();

        // --- BIỂU ĐỒ ---
        $revenueByDate = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as revenue')
            )
            ->whereIn('status', ['Fulfilled', 'Processing'])
            ->whereBetween('created_at', [$start, $end])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy(DB::raw('DATE(created_at)'))
            ->get();

        $ordersByDate = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as orders')
            )
            ->whereIn('status', ['Fulfilled', 'Processing'])
            ->whereBetween('created_at', [$start, $end])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy(DB::raw('DATE(created_at)'))
            ->get();

        // --- ĐƠN GẦN ĐÂY ---
        $recentOrders = $ordersQuery->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(fn($o) => [
                'id' => $o->id,
                'customer' => $o->user->name ?? 'Unknown',
                'total' => $o->total,
                'status' => $o->status,
                'date' => $o->created_at->format('Y-m-d'),
            ]);

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'avgOrderValue' => $avgOrderValue,
            'newCustomers' => $newCustomers,
            'revenueByDate' => $revenueByDate,
            'ordersByDate' => $ordersByDate,
            'recentOrders' => $recentOrders
        ]);
    }
}
