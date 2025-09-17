<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        // Tổng số đơn hàng
        $totalOrders = Order::count();

        // Tổng doanh thu (đã bao gồm phí ship)
        $totalRevenue = Order::sum('total');

        // Tổng số khách hàng (nếu user có cột role)
        $totalCustomers = User::where('role', 'customer')->count();

        // Top 5 sản phẩm bán chạy
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->selectRaw('products.name, SUM(order_items.quantity) as qty, SUM(order_items.price) as revenue')
            ->groupBy('products.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        // Lấy 5 đơn hàng gần nhất
        $recentOrders = Order::with('user')->latest()->take(5)->get();

        return response()->json([
            'totalOrders'    => $totalOrders,
            'totalRevenue'   => $totalRevenue,
            'totalCustomers' => $totalCustomers,
            'topProducts'    => $topProducts,
            'recentOrders'   => $recentOrders,
        ]);
    }
}
