<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Uzytkownik extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'uzytkownicy';

    protected $fillable = [
        'imie',
        'nazwisko',
        'email',
        'haslo',
        'rola',
        'zdjecie_profilowe',
        'status',
        'numer_telefonu', // jeśli jest w bazie
    ];

    protected $hidden = [
        'haslo',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'haslo' => 'hashed',
    ];

    public function getAuthPassword()
    {
        return $this->haslo;
    }

    public function recenzje()
    {
        return $this->hasMany(Recenzja::class, 'uzytkownik_id');
    }

    public function ebooki()
    {
        return $this->hasMany(Ebook::class, 'uzytkownik_id');
    }

}
