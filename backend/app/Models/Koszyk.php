<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Koszyk extends Model
{
    use HasFactory;

    protected $table = 'koszyk';

    protected $fillable = [
        'uzytkownik_id',
        'ebook_id',
        'ilosc',
    ];
}
