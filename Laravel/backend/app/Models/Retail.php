<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Retail extends Model
{
    use HasFactory;
    protected $table = 'retail';
    protected $fillable = ['product_id','quantity','price','sale_date'];
}
