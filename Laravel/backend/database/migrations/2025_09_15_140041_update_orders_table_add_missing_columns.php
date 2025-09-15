<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Thêm cột nếu chưa có
            if (!Schema::hasColumn('orders', 'customer')) {
                $table->string('customer')->after('id');
            }
            if (!Schema::hasColumn('orders', 'email')) {
                $table->string('email')->nullable()->after('customer');
            }
            if (!Schema::hasColumn('orders', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }
            if (!Schema::hasColumn('orders', 'address')) {
                $table->string('address')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('orders', 'payment')) {
                $table->string('payment')->default('COD')->after('total');
            }

            // Đổi kiểu cột status thành enum (nếu cần)
            $table->enum('status', ['Processing', 'Fulfilled', 'Cancelled'])
                  ->default('Processing')
                  ->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['customer', 'email', 'phone', 'address', 'payment']);
            // Bạn có thể bỏ change status ở đây nếu cần revert về kiểu cũ
        });
    }
};
