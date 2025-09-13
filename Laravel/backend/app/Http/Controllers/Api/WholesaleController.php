<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Wholesale;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WholesaleController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id'=>'required|exists:products,id',
            'quantity'=>'required|integer|min:1',
            'price'=>'required|numeric|min:0',
            'sale_date'=>'nullable|date',
        ]);

        DB::transaction(function() use ($data) {
            $wh = Wholesale::create($data);
            $product = Product::findOrFail($data['product_id']);
            $product->stock = max(0, ($product->stock ?? 0) - $data['quantity']);
            $product->save();
        });

        return response()->json(['message'=>'Wholesale saved and stock reduced'],201);
    }

    public function index(){ return response()->json(Wholesale::with('product')->paginate(20)); }
}
