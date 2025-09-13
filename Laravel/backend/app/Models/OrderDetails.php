<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OderDetails extends Model
{
    use HasFactory;
    protected $table = 'order_details';
    protected $fillable = ['order_id','product_id','quantity','price'];
}
