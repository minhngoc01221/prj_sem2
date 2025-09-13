<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;   // 👉 dùng bảng users
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Thống kê nhanh
        $conversion = 2.4; // giả sử tính toán
        $revenue = Order::sum('total'); // tổng doanh thu
        $orders = Order::count();       // tổng số đơn hàng
        $customers = User::count();     // tổng số khách hàng (từ bảng users)

        // Sales chart (theo tháng)
        $sales = Order::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total) as sales')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function($item) {
                return [
                    'month' => date("M", mktime(0, 0, 0, $item->month, 1)),
                    'sales' => $item->sales
                ];
            });

        // Top products
        $topProducts = Product::select('products.name', 'products.thumbnail', DB::raw('SUM(order_items.quantity * order_items.price) as revenue'))
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->groupBy('products.id', 'products.name', 'products.thumbnail')
            ->orderByDesc('revenue')
            ->take(5)
            ->get();

        // Recent Orders
        $recentOrders = Order::with('customer')
            ->orderByDesc('created_at')
            ->take(5)
            ->get()
            ->map(function($order) {
                return [
                    'id' => $order->id,
                    'customer' => $order->customer->name ?? 'Guest',
                    'date' => $order->created_at->format('Y-m-d'),
                    'amount' => $order->total,
                    'status' => $order->status
                ];
            });

        return response()->json([
            'stats' => [
                'conversion' => $conversion,
                'revenue'    => $revenue,
                'orders'     => $orders,
                'customers'  => $customers,
            ],
            'sales'        => $sales,
            'topProducts'  => $topProducts,
            'recentOrders' => $recentOrders
        ]);
    }
}
