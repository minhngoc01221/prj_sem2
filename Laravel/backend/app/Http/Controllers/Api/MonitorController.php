<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Monitor;
use Illuminate\Http\Request;

class MonitorController extends Controller
{
    public function index(){ return response()->json(Monitor::orderBy('created_at','desc')->paginate(50)); }
    public function store(Request $request){
        $data = $request->validate(['activity'=>'required|string|max:200','user_id'=>'nullable|integer']);
        return response()->json(Monitor::create($data),201);
    }
}
