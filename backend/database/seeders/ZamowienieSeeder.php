<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Zamowienie;
use App\Models\Ebook;
use Illuminate\Support\Carbon;

class ZamowienieSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            $zamowienie = Zamowienie::create([
                'uzytkownik_id' => 1, // albo inny istniejący użytkownik
                'status' => 'zrealizowane',
                'suma' => 0,
                'created_at' => Carbon::now()->subDays(rand(0, 365)),
                'updated_at' => now(),
            ]);

            // Do zamówienia przypisz losowe ebooki
            $ebooki = Ebook::inRandomOrder()->take(rand(1, 3))->get();

            $suma = 0;

            foreach ($ebooki as $ebook) {
                $zamowienie->ebooki()->attach($ebook->id, [
                    'cena_jednostkowa' => $ebook->cena_promocyjna ?? $ebook->cena,
                    'ilosc' => 1,
                ]);
                $suma += $ebook->cena_promocyjna ?? $ebook->cena;
            }

            $zamowienie->update(['suma' => $suma]);


        }
    }
}
