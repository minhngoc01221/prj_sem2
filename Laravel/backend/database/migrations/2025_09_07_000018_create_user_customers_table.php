<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_customer', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 100)->nullable();
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_customer');
    }
};
