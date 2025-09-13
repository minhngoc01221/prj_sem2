<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; // Thêm dòng này
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        return Category::create($data);
    }

    public function show($id)
    {
        return Category::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $item = Category::findOrFail($id);
        $item->update($request->all());
        return $item;
    }

    public function destroy($id)
    {
        Category::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}