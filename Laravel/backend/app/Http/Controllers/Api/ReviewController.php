<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // Lấy tất cả review (public)
    public function index()
    {
        $reviews = Review::with(['product:id,name', 'customer:id,name,email'])
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    // Thêm review (yêu cầu login)
    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'required|string|max:500',
        ]);

        // Gán user id từ người đang đăng nhập
        $data['customer_id'] = auth()->id();

        $review = Review::create($data);

        return response()->json(
            $review->load(['product:id,name', 'customer:id,name,email']),
            201
        );
    }

    // Xem chi tiết review
    public function show($id)
    {
        $review = Review::with(['product:id,name', 'customer:id,name,email'])->findOrFail($id);
        return response()->json($review);
    }

    // Cập nhật review (chỉ chủ review mới được sửa)
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        // Chỉ cho phép chủ review sửa
        if ($review->customer_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'rating'  => 'sometimes|integer|min:1|max:5',
            'comment' => 'sometimes|string|max:500',
        ]);

        $review->update($data);

        return response()->json($review->fresh());
    }

    // Xóa review (chỉ chủ review mới được xóa)
    public function destroy($id)
    {
        $review = Review::findOrFail($id);

        if ($review->customer_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
