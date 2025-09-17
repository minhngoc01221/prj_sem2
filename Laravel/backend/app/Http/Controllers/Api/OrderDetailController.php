<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\OrderDetail;
use Illuminate\Http\Request;

class OrderDetailController extends Controller
{
    public function index(){ return response()->json(OrderDetails::with('product')->paginate(20)); }
    public function show($id){ return response()->json(OrderDetails::findOrFail($id)); }
    public function destroy($id){ OrderDetails::destroy($id); return response()->json(['message'=>'Detail removed']); }
}
