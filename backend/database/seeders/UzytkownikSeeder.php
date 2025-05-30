<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Uzytkownik;
use Illuminate\Support\Facades\Hash;

class UzytkownikSeeder extends Seeder
{
    public function run(): void
    {
        Uzytkownik::create([
            'imie' => 'Jan',
            'nazwisko' => 'Kowalski',
            'email' => 'test@example.com',
            'haslo' => Hash::make('tajnehaslo'),
            'rola' => 'klient',
            'avatar' => 'avatar1.png',
            'status' => 'aktywny',
        ]);

        Uzytkownik::create([
            'imie' => 'Anna',
            'nazwisko' => 'Nowak',
            'email' => 'anna@example.com',
            'haslo' => Hash::make('tajnehaslo'),
            'rola' => 'klient',
            'status' => 'aktywny',
        ]);

        Uzytkownik::create([
            'imie' => 'Admin',
            'nazwisko' => 'Serwis',
            'email' => 'admin@example.com',
            'haslo' => Hash::make('adminhaslo'),
            'rola' => 'admin',
            'status' => 'aktywny',
        ]);
    }
}
