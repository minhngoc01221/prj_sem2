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
        // --- HÔM NAY ---
        $todayStart = Carbon::now('Asia/Ho_Chi_Minh')->startOfDay();
        $todayEnd   = Carbon::now('Asia/Ho_Chi_Minh')->endOfDay();

        $todayOrders = Order::whereIn('status', ['Fulfilled', 'Processing'])
            ->whereBetween('created_at', [$todayStart, $todayEnd]);

        $totalRevenue = $todayOrders->sum('total');
        $totalOrders = $todayOrders->count();
        $avgOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;
        $newCustomers = User::where('role', 'Customer')
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->count();

        // --- HÔM QUA ---
        $yesterdayStart = Carbon::yesterday('Asia/Ho_Chi_Minh')->startOfDay();
        $yesterdayEnd   = Carbon::yesterday('Asia/Ho_Chi_Minh')->endOfDay();

        $yesterdayOrdersQuery = Order::whereIn('status', ['Fulfilled', 'Processing'])
            ->whereBetween('created_at', [$yesterdayStart, $yesterdayEnd]);

        $yesterdayRevenue = $yesterdayOrdersQuery->sum('total');
        $yesterdayOrders = $yesterdayOrdersQuery->count();
        $yesterdayAvg = $yesterdayOrders > 0 ? round($yesterdayRevenue / $yesterdayOrders, 2) : 0;
        $yesterdayCustomers = User::where('role', 'Customer')
            ->whereBetween('created_at', [$yesterdayStart, $yesterdayEnd])
            ->count();

        // --- TÍNH % THAY ĐỔI ---
        $revenueChange = $yesterdayRevenue > 0 ? round((($totalRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100, 1) : 0;
        $ordersChange = $yesterdayOrders > 0 ? round((($totalOrders - $yesterdayOrders) / $yesterdayOrders) * 100, 1) : 0;
        $avgChange = $yesterdayAvg > 0 ? round((($avgOrderValue - $yesterdayAvg) / $yesterdayAvg) * 100, 1) : 0;
        $customersChange = $yesterdayCustomers > 0 ? round((($newCustomers - $yesterdayCustomers) / $yesterdayCustomers) * 100, 1) : 0;

        // --- BIỂU ĐỒ ---
        $revenueByDate = Order::select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as revenue'))
            ->whereIn('status', ['Fulfilled', 'Processing'])
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy(DB::raw('DATE(created_at)'))
            ->get();

        $ordersByDate = Order::select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as orders'))
            ->whereIn('status', ['Fulfilled', 'Processing'])
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy(DB::raw('DATE(created_at)'))
            ->get();

        // --- ĐƠN GẦN ĐÂY ---
        $recentOrders = $todayOrders->with('user:id,name')
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
            'recentOrders' => $recentOrders,
            'revenueChange' => $revenueChange,
            'ordersChange' => $ordersChange,
            'avgChange' => $avgChange,
            'customersChange' => $customersChange
        ]);
    }
}
