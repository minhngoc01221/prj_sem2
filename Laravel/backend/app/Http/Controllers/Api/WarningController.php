<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Warning;
use Illuminate\Http\Request;

class WarningController extends Controller
{
    public function index(){ return response()->json(Warning::orderBy('created_at','desc')->paginate(50)); }
    public function store(Request $request){ $data = $request->validate(['message'=>'required|string','level'=>'nullable|string','user_id'=>'nullable|integer']); return response()->json(Warning::create($data),201); }
}
