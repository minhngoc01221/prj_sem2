<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 1 sản phẩm mẫu
        Product::create([
            'category_id' => 1,
            'supplier_id' => 1,
            'name' => 'Holcim Cement',
            'price' => 75.5,
            'stock' => 100,
        ]);

        // 20 sản phẩm giả
        Product::factory()->count(20)->create();
    }
}
