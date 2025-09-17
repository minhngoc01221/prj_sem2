<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Lấy danh sách đơn hàng kèm user + chi tiết sản phẩm
    public function index()
    {
        return response()->json(
            Order::with(['user', 'items.product'])->latest()->paginate(20)
        );
    }

    // Lấy chi tiết một đơn hàng
    public function show($id)
    {
        return response()->json(
            Order::with(['user', 'items.product'])->findOrFail($id)
        );
    }

    // Tạo đơn hàng mới
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
            // ✅ Tạo đơn hàng với tổng ban đầu = 0
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

                // ✅ Lưu chi tiết từng sản phẩm
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity'   => $it['quantity'],
                    'price'      => $linePrice,
                ]);

                // ✅ Giảm tồn kho
                $product->stock = max(0, ($product->stock ?? 0) - $it['quantity']);
                $product->save();

                $total += $linePrice;
            }

            // ✅ Cộng phí ship cố định 5 USD
            $order->update(['total' => $total + 5]);
        });

        return response()->json(
            $order->load(['user', 'items.product']),
            201
        );
    }

    // Cập nhật trạng thái đơn hàng
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json($order);
    }
}
