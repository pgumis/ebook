<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ebook;
use Illuminate\Support\Carbon;

class EbookSeeder extends Seeder
{
    public function run(): void
    {
        $formats = ['EPUB', 'PDF', 'MOBI'];

        for ($i = 1; $i <= 20; $i++) {
            Ebook::create([
                'uzytkownik_id' => rand(1, 3),
                'tytul' => 'Ebook '.$i,
                'autor' => 'Autor '.$i,
                'cena' => rand(20, 60),
                'cena_promocyjna' => rand(0, 1) ? rand(10, 19) : null,
                'format' => $formats[array_rand($formats)],
                'status' => 'aktywny',
                'created_at' => Carbon::now()->subDays(rand(0, 365)),
                'updated_at' => now(),
            ]);
        }
    }
}
