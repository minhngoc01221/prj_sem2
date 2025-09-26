<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product'])->latest();

        if ($request->has('userId')) {
            $query->where('user_id', $request->userId);
        }

        if ($request->boolean('checkOnly')) {
            return response()->json([
                'hasOrders' => $query->exists()
            ]);
        }

        return response()->json($query->paginate(20));
    }

    public function show($id)
    {
        return response()->json(
            Order::with(['user', 'items.product'])->findOrFail($id)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'payment' => 'nullable|string',
            'status'  => 'nullable|string',
            'items'   => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
        ]);

        $order = null;

        DB::transaction(function () use ($data, &$order) {
            $order = Order::create([
                'user_id' => $data['user_id'],
                'total'   => 0,
                'status'  => $data['status'] ?? 'Processing',
                'payment' => $data['payment'] ?? 'COD',
            ]);

            $total = 0;

            foreach ($data['items'] as $it) {
                $product = Product::findOrFail($it['product_id']);
                $linePrice = ($product->price ?? 0) * $it['quantity'];

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity'   => $it['quantity'],
                    'price'      => $linePrice,
                ]);

                $product->stock = max(0, ($product->stock ?? 0) - $it['quantity']);
                $product->save();

                $total += $linePrice;
            }

            $order->update(['total' => $total + 5]);
        });

        return response()->json(
            $order->load(['user', 'items.product']),
            201
        );
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        $todayStart = Carbon::now('Asia/Ho_Chi_Minh')->startOfDay();
        $todayEnd   = Carbon::now('Asia/Ho_Chi_Minh')->endOfDay();

        $totalOrdersToday = Order::whereBetween('created_at', [$todayStart, $todayEnd])->count();
        $totalRevenueToday = Order::whereBetween('created_at', [$todayStart, $todayEnd])->sum('total');

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'order' => $order,
            'totalOrdersToday' => $totalOrdersToday,
            'totalRevenueToday' => $totalRevenueToday,
        ]);
    }

    public function reports(Request $request)
    {
        $range = $request->query('range', 'daily');

        // ✅ Sửa timezone chuẩn cho VN
        $todayStart = Carbon::now('Asia/Ho_Chi_Minh')->startOfDay();
        $todayEnd   = Carbon::now('Asia/Ho_Chi_Minh')->endOfDay();

        $todayOrders = Order::whereBetween('created_at', [$todayStart, $todayEnd])->get();

        $totalRevenue = $todayOrders->sum('total');
        $totalOrders = $todayOrders->count();
        $avgOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        $newCustomers = User::whereBetween('created_at', [$todayStart, $todayEnd])->count();

        if ($range === 'weekly') {
            $revenueByDate = Order::selectRaw('YEARWEEK(created_at) as date, SUM(total) as revenue')
                ->groupBy('date')->orderBy('date')->get();
            $ordersByDate = Order::selectRaw('YEARWEEK(created_at) as date, COUNT(*) as orders')
                ->groupBy('date')->orderBy('date')->get();
        } elseif ($range === 'monthly') {
            $revenueByDate = Order::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as date, SUM(total) as revenue')
                ->groupBy('date')->orderBy('date')->get();
            $ordersByDate = Order::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as date, COUNT(*) as orders')
                ->groupBy('date')->orderBy('date')->get();
        } else {
            $revenueByDate = Order::selectRaw('DATE(created_at) as date, SUM(total) as revenue')
                ->groupBy('date')->orderBy('date')->get();
            $ordersByDate = Order::selectRaw('DATE(created_at) as date, COUNT(*) as orders')
                ->groupBy('date')->orderBy('date')->get();
        }

        $recentOrders = $todayOrders->map(fn($order) => [
            'id' => $order->id,
            'customer' => $order->user->name ?? 'Khách lạ',
            'date' => $order->created_at->format('Y-m-d'),
            'total' => $order->total,
            'status' => $order->status,
        ]);

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'avgOrderValue' => $avgOrderValue,
            'newCustomers' => $newCustomers,
            'revenueByDate' => $revenueByDate,
            'ordersByDate' => $ordersByDate,
            'recentOrders' => $recentOrders,
        ]);
    }
}
