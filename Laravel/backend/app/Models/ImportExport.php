<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportExport extends Model
{
    use HasFactory;

    protected $table = 'import_export';

    protected $fillable = [
        'type',
        'product_id',
        'quantity',
        'date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
