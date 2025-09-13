<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Repost;
use Illuminate\Http\Request;

class RepostController extends Controller
{
    public function store(Request $request){
        $data = $request->validate(['post_id'=>'required|integer','user_id'=>'required|integer']);
        return response()->json(Repost::create($data),201);
    }
}
