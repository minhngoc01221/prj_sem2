<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wholesale extends Model
{
    use HasFactory;
    protected $table = 'wholesale';
    protected $fillable = ['product_id','quantity','price','sale_date'];
}
