<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->nullable();   // mã sản phẩm
            $table->string('thumbnail')->nullable(); // ảnh sản phẩm
            $table->decimal('price', 10, 2)->default(0);
            $table->integer('stock')->default(0); // số lượng tồn
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
