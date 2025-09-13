<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ImportExport;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ImportExportController extends Controller
{
    // record import or export and update product stock accordingly
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:import,export',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'date' => 'nullable|date',
        ]);

        DB::transaction(function() use ($data) {
            $record = ImportExport::create($data);

            $product = Product::findOrFail($data['product_id']);
            if ($data['type'] === 'import') {
                $product->stock = ($product->stock ?? 0) + $data['quantity'];
            } else {
                $product->stock = max(0, ($product->stock ?? 0) - $data['quantity']);
            }
            $product->save();
        });

        return response()->json(['message'=>'Import/Export recorded and stock updated'],201);
    }
}
