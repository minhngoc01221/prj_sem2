<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supplier;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        Supplier::create(['name'=>'Holcim','phone'=>'0901234567','email'=>'sales@holcim.vn','address'=>'HCM']);
    }
}
