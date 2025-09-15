<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('customer');          // Tên khách hàng
            $table->string('email')->nullable(); // Email khách hàng
            $table->string('phone')->nullable(); // Số điện thoại
            $table->string('address')->nullable(); // Địa chỉ giao hàng
            $table->decimal('total', 10, 2);
            $table->enum('status', ['Processing', 'Fulfilled', 'Cancelled'])->default('Processing');
            $table->string('payment')->default('COD'); // Payment method
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
