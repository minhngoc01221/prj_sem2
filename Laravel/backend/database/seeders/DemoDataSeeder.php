<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // User
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Nguyen Van A',
                'password' => bcrypt('123456')
            ]
        );

        // Product
        $product = Product::firstOrCreate(
            ['name' => 'Laptop Test'],
            [
                'thumbnail' => 'laptop.png',
                'price' => 1500,
                'stock' => 10,
            ]
        );

        // Order
        $order = Order::create([
            'user_id' => $user->id,
            'total' => 1500,
            'status' => 'completed'
        ]);

        // Order Item
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price' => 1500
        ]);
    }
}
