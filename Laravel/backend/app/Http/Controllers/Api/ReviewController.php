<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(){ return response()->json(Review::with('product')->paginate(20)); }

    public function store(Request $request){
        $data = $request->validate([
            'product_id'=>'required|exists:products,id',
            'customer_id'=>'required|exists:user_customer,id',
            'rating'=>'required|integer|min:1|max:5',
            'comment'=>'nullable|string',
        ]);

        $review = Review::create($data);

        // Optionally update product average rating (simple approach)
        $product = Product::find($data['product_id']);
        if ($product) {
            $avg = $product->reviews()->avg('rating');
            $product->rating = $avg;
            $product->save();
        }

        return response()->json($review,201);
    }
}
