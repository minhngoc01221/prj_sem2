<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\UserTransport;
use Illuminate\Http\Request;

class UserTransportController extends Controller
{
    public function index(){ return response()->json(UserTransport::paginate(20)); }
    public function store(Request $request){
        $data = $request->validate(['name'=>'required|string|max:100','phone'=>'nullable|string|max:20','address'=>'nullable|string']);
        return response()->json(UserTransport::create($data),201);
    }
    public function destroy($id){ UserTransport::destroy($id); return response()->json(['message'=>'Transport removed']); }
}
