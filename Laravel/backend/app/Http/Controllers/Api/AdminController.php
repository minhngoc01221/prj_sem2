<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return Admin::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        return Admin::create($data);
    }

    public function show($id)
    {
        return Admin::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $item = Admin::findOrFail($id);
        $item->update($request->all());
        return $item;
    }

    public function destroy($id)
    {
        Admin::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
