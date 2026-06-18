<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'description',
        'price',
        'type',
        'category',
        'image',
        'is_featured',
        'is_available',
    ];

    protected $casts = [
        'price' => 'float',
        'is_featured' => 'boolean',
        'is_available' => 'boolean',
    ];
}
