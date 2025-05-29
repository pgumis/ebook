<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ebook extends Model
{
    use HasFactory;

    protected $table = 'ebooki';

    protected $fillable = [
        'tytul',
        'autor',
        'opis',
        'isbn',
        'liczba_stron',
        'wydawnictwo',
        'kategoria',
        'jezyk',
        'data_wydania',
        'cena',
        'format',
        'plik',
        'okladka',
    ];

    public function zamowienia()
    {
        return $this->belongsToMany(Zamowienie::class, 'ebook_zamowienie');
    }

}
