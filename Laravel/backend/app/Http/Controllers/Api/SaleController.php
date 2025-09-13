<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function index(){ return response()->json(Sale::all()); }
    public function store(Request $request){
        $data = $request->validate([
            'product_id'=>'required|exists:products,id',
            'discount'=>'required|numeric|min:0',
            'start_date'=>'required|date',
            'end_date'=>'nullable|date',
        ]);
        return response()->json(Sale::create($data),201);
    }
    public function destroy($id){ Sale::destroy($id); return response()->json(['message'=>'Sale removed']); }
}
