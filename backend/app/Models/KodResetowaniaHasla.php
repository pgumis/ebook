<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KodResetowaniaHasla extends Model
{
    use HasFactory;

    protected $table = 'kody_resetowania_hasla';

    protected $fillable = [
        'email',
        'kod',
        'waznosc',
    ];

    public $timestamps = true;
}
