<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;
use App\Models\Supplier;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => Category::inRandomOrder()->first()->id ?? 1,
            'supplier_id' => Supplier::inRandomOrder()->first()->id ?? 1,
            'name' => $this->faker->word() . ' ' . $this->faker->randomElement(['Cement', 'Steel', 'Bricks']),
            'price' => $this->faker->randomFloat(2, 10, 200), // giá từ 10 đến 200
            'stock' => $this->faker->numberBetween(10, 500), // số lượng tồn kho
        ];
    }
}
