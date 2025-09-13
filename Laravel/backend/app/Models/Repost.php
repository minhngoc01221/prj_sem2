<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Repost extends Model
{
    use HasFactory;
    protected $table = 'repost';
    protected $fillable = ['post_id','user_id'];
}
