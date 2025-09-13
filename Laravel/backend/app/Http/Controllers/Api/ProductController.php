<?php

// app/Http/Controllers/Api/ProductController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Lấy danh sách (có phân trang)
    public function index(Request $request)
    {
        $limit = $request->input('limit', 15);
        $products = Product::orderBy('updated_at', 'desc')->paginate($limit);

        return response()->json([
            "data" => $products->items(),
            "total" => $products->total(),
            "current_page" => $products->currentPage(),
        ]);
    }

    // Lấy chi tiết 1 sản phẩm
    public function show($id)
    {
        return Product::findOrFail($id);
    }

    // Tạo mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "sku" => "required|string|max:255|unique:products",
            "price" => "required|numeric|min:0",
            "stock" => "required|integer|min:0",
            "thumbnail" => "nullable|string",
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    // Cập nhật
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            "name" => "required|string|max:255",
            "sku" => "required|string|max:255|unique:products,sku,".$id,
            "price" => "required|numeric|min:0",
            "stock" => "required|integer|min:0",
            "thumbnail" => "nullable|string",
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    // Xóa
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(["message" => "Deleted successfully"]);
    }
}
