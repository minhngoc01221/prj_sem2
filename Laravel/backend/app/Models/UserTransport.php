<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserTransport extends Model
{
    use HasFactory;
    protected $table = 'user_transport';
    protected $fillable = ['name','phone','address'];
}
