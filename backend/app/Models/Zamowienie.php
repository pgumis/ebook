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

    public function ebooki()
    {
        return $this->belongsToMany(Ebook::class, 'ebook_zamowienie')
            ->withPivot('cena_jednostkowa')
            ->withTimestamps();
    }

    public function uzytkownik()
    {
        return $this->belongsTo(Uzytkownik::class);
    }



}
