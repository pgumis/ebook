<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zamowienie extends Model
{
    use HasFactory;

    protected $table = 'zamowienia';

    protected $fillable = [
        'uzytkownik_id',
        'data_zamowienia',
        'suma',
        'status',
    ];
}
