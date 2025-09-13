<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('import_export', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['import','export']);
            $table->unsignedBigInteger('product_id')->nullable();
            $table->integer('quantity')->default(0);
            $table->timestamp('date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('import_export');
    }
};
