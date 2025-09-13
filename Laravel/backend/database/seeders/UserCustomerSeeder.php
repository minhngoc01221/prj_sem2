<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UserCustomer;

class UserCustomerSeeder extends Seeder
{
    public function run(): void
    {
        UserCustomer::create(['name'=>'Nguyen Van A','email'=>'vana@example.com','phone'=>'0123456789','address'=>'Ha Noi']);
    }
}
