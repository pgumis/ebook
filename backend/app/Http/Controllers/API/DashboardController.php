<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ebook;
use App\Models\Zamowienie;
use App\Models\Uzytkownik; // Dodaj ten use statement
use Carbon\Carbon;
use Illuminate\Support\Facades\DB; // Dodaj ten use statement dla DB::table

class DashboardController extends Controller
{
    /**
     * Zwraca statystyki dashboardu dla zalogowanego dostawcy.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function statystykaDostawcy(Request $request)
    {
        $idUzytkownika = $request->user()->id; // ID zalogowanego użytkownika (dostawcy)

        // 1. Liczba wystawionych książek (ebooków) przez TEGO dostawcę
        // Używamy relacji 'ebooki' z modelu Uzytkownik, jeśli jest zdefiniowana
        // LUB bezpośrednio filtrujemy po ebookach:
        $wystawioneKsiazki = Ebook::where('uzytkownik_id', $idUzytkownika)->count();

        // 2. Sprzedanych w tym miesiącu i Zysk w tym miesiącu
        $poczatekMiesiaca = Carbon::now()->startOfMonth();
        $koniecMiesiaca = Carbon::now()->endOfMonth();

        // Pobieramy pozycje zamówień dla ebooków danego dostawcy,
        // które należą do zamówień zrealizowanych w bieżącym miesiącu.
        // Używamy DB::table do bezpośredniego zapytania do tabel pośrednich dla wydajności.
        $daneSprzedazy = DB::table('ebook_zamowienie')
            ->join('ebooki', 'ebook_zamowienie.ebook_id', '=', 'ebooki.id')
            ->join('zamowienia', 'ebook_zamowienie.zamowienie_id', '=', 'zamowienia.id')
            ->where('ebooki.uzytkownik_id', $idUzytkownika) // eBook należy do naszego dostawcy
            ->whereBetween('zamowienia.data_zamowienia', [$poczatekMiesiaca, $koniecMiesiaca])
            ->where('zamowienia.status', 'completed') // Tylko zrealizowane zamówienia
            ->select(
                'ebook_zamowienie.cena_jednostkowa',
                'ebook_zamowienie.ilosc' // Kolumna 'ilosc' z tabeli pośredniej
            )
            ->get();

        $sprzedanychWtymMiesiacu = 0;
        $zyskWtymMiesiacu = 0;

        foreach ($daneSprzedazy as $item) {
            $ilosc = $item->ilosc ?? 1; // Użyj ilości z pivot, domyślnie 1 jeśli null/nie ma
            $sprzedanychWtymMiesiacu += $ilosc;
            $zyskWtymMiesiacu += ($item->cena_jednostkowa * $ilosc);
        }

        $zyskWtymMiesiacuSformatowany = number_format($zyskWtymMiesiacu, 2, ',', '') . ' zł';

        return response()->json([
            'publishedBooks' => $wystawioneKsiazki,
            'soldThisMonth' => $sprzedanychWtymMiesiacu,
            'profitThisMonth' => $zyskWtymMiesiacuSformatowany,
        ], 200);
    }
}
