<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(){ return response()->json(Inventory::with('product')->paginate(20)); }

    // Quick update stock from inventory record
    public function update(Request $request, $id)
    {
        $inv = Inventory::findOrFail($id);
        $data = $request->validate(['quantity'=>'required|integer']);
        $inv->update($data);

        $product = Product::find($inv->product_id);
        if ($product) {
            $product->stock = $data['quantity'];
            $product->save();
        }

        return response()->json($inv);
    }
}
