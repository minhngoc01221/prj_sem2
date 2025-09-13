<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ImagePost;
use Illuminate\Http\Request;

class ImagePostController extends Controller
{
    public function index(){ return response()->json(ImagePost::paginate(20)); }
    public function store(Request $request){
        $data = $request->validate(['title'=>'nullable|string|max:200','image_url'=>'required|url','user_id'=>'nullable|integer']);
        return response()->json(ImagePost::create($data),201);
    }
    public function destroy($id){ ImagePost::destroy($id); return response()->json(['message'=>'Image post removed']); }
}
