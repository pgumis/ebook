<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recenzja extends Model
{
protected $table = 'recenzje';

protected $fillable = ['uzytkownik_id', 'ebook_id', 'ocena', 'tresc'];

public function ebook()
{
return $this->belongsTo(Ebook::class, 'ebook_id');
}

public function uzytkownik()
{
return $this->belongsTo(Uzytkownik::class, 'uzytkownik_id');
}
}
