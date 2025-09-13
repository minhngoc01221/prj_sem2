<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OderController extends Controller
{
    public function index(){ return response()->json(Order::with(['orderDetails.product','customer','transport'])->paginate(20)); }

    public function show($id){ return response()->json(Order::with(['orderDetails.product','customer'])->findOrFail($id)); }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id'=>'required|exists:user_customer,id',
            'transport_id'=>'nullable|exists:user_transport,id',
            'order_date'=>'required|date',
            'status'=>'required|string',
            'items'=>'required|array|min:1',
            'items.*.product_id'=>'required|exists:products,id',
            'items.*.quantity'=>'required|integer|min:1',
        ]);

        $order = null;
        DB::transaction(function() use ($data, &$order) {
            $order = Order::create([
                'customer_id'=>$data['customer_id'],
                'transport_id'=>$data['transport_id'] ?? null,
                'order_date'=>$data['order_date'],
                'total'=>0,
                'status'=>$data['status'],
            ]);

            $total = 0;
            foreach ($data['items'] as $it) {
                $product = Product::findOrFail($it['product_id']);
                $linePrice = ($product->price ?? 0) * $it['quantity'];
                $order->orderDetails()->create([
                    'product_id'=>$product->id,
                    'quantity'=>$it['quantity'],
                    'price'=>$linePrice,
                ]);
                // reduce stock
                $product->stock = max(0, ($product->stock ?? 0) - $it['quantity']);
                $product->save();
                $total += $linePrice;
            }
            $order->update(['total'=>$total]);
        });

        return response()->json($order->load('orderDetails.product'),201);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $request->validate(['status'=>'required|string']);
        $order->status = $request->status;
        $order->save();
        return response()->json($order);
    }
}
