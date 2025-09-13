<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\UserCustomers;
use Illuminate\Http\Request;

class UserCustomersController extends Controller
{
    public function index(){ return response()->json(UserCustomers::paginate(20)); }
    public function show($id){ return response()->json(UserCustomers::findOrFail($id)); }
    public function store(Request $request){
        $data = $request->validate(['name'=>'required|string|max:100','email'=>'required|email|unique:user_customer,email','phone'=>'nullable|string|max:20','address'=>'nullable|string']);
        return response()->json(UserCustomers::create($data),201);
    }
    public function update(Request $request,$id){
        $uc = UserCustomers::findOrFail($id);
        $data = $request->validate(['name'=>'sometimes|required|string|max:100','email'=>'sometimes|required|email','phone'=>'nullable|string|max:20','address'=>'nullable|string']);
        $uc->update($data); return response()->json($uc);
    }
    public function destroy($id){ UserCustomers::destroy($id); return response()->json(['message'=>'Customer removed']); }
}
