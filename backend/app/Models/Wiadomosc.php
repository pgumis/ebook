<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wiadomosc extends Model
{
    use HasFactory;

    protected $table = 'wiadomosci';

    protected $fillable = [
        'uzytkownik_id',
        'imie',
        'email',
        'temat',
        'tresc',
        'przeczytana',
    ];
}
