<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(
            Order::with(['user', 'items.product'])->latest()->paginate(20)
        );
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

    // ✅ Cập nhật trạng thái đơn hàng + trả dữ liệu dashboard mới
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        $todayStart = now()->startOfDay();
        $todayEnd = now()->endOfDay();

        $totalOrdersToday = Order::whereIn('status', ['Fulfilled', 'Processing'])
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->count();

        $totalRevenueToday = Order::whereIn('status', ['Fulfilled', 'Processing'])
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->sum('total');

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'order' => $order,
            'totalOrdersToday' => $totalOrdersToday,
            'totalRevenueToday' => $totalRevenueToday,
        ]);
    }
}
