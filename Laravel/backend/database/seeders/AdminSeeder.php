<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::create(['username'=>'admin','password'=>bcrypt('123456'),'email'=>'admin@example.com']);
    }
}
