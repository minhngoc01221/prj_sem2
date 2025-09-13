<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Monitor;
use App\Models\Warning;
use App\Models\UserTransport;

class MonitorWarningTransportSeeder extends Seeder
{
    public function run(): void
    {
        Monitor::create(['activity'=>'System check','user_id'=>1]);
        Warning::create(['message'=>'Low stock','level'=>'high','user_id'=>1]);
        UserTransport::create(['name'=>'Tran Van B','phone'=>'0987654321','address'=>'HCM']);
    }
}
