<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;

class DashboardSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo user mẫu
        $user1 = User::factory()->create(['name' => 'Nguyen Van A']);
        $user2 = User::factory()->create(['name' => 'Tran Thi B']);

        // Tạo products mẫu
        $p1 = Product::create(['name' => 'Laptop Dell', 'thumbnail' => '/img/dell.png', 'price' => 1200]);
        $p2 = Product::create(['name' => 'iPhone 14', 'thumbnail' => '/img/iphone.png', 'price' => 999]);
        $p3 = Product::create(['name' => 'Tai nghe Sony', 'thumbnail' => '/img/sony.png', 'price' => 199]);

        // Order 1
        $order1 = Order::create([
            'user_id' => $user1->id,
            'total' => 2199,
            'status' => 'Paid',
        ]);
        OrderItem::create(['order_id' => $order1->id, 'product_id' => $p1->id, 'quantity' => 1, 'price' => 1200]);
        OrderItem::create(['order_id' => $order1->id, 'product_id' => $p2->id, 'quantity' => 1, 'price' => 999]);

        // Order 2
        $order2 = Order::create([
            'user_id' => $user2->id,
            'total' => 199,
            'status' => 'Pending',
        ]);
        OrderItem::create(['order_id' => $order2->id, 'product_id' => $p3->id, 'quantity' => 1, 'price' => 199]);

        // Order 3
        $order3 = Order::create([
            'user_id' => $user1->id,
            'total' => 999,
            'status' => 'Shipped',
        ]);
        OrderItem::create(['order_id' => $order3->id, 'product_id' => $p2->id, 'quantity' => 1, 'price' => 999]);
    }
}
