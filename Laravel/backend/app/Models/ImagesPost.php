<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagesPost extends Model
{
    use HasFactory;
    protected $table = 'images_post';
    protected $fillable = ['title','image_url','user_id'];
}
