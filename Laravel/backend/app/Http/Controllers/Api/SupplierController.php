<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(){ return response()->json(Supplier::all()); }
    public function show($id){ return response()->json(Supplier::findOrFail($id)); }
    public function store(Request $request){
        $data = $request->validate([
            'name'=>'required|string|max:100',
            'phone'=>'nullable|string|max:20',
            'email'=>'nullable|email|max:100',
            'address'=>'nullable|string'
        ]);
        return response()->json(Supplier::create($data),201);
    }
    public function update(Request $request,$id){
        $sup = Supplier::findOrFail($id);
        $data = $request->validate([ 'name'=>'sometimes|required|string|max:100','phone'=>'nullable|string|max:20','email'=>'nullable|email|max:100','address'=>'nullable|string' ]);
        $sup->update($data); return response()->json($sup);
    }
    public function destroy($id){ Supplier::destroy($id); return response()->json(['message'=>'Supplier deleted']); }
}
