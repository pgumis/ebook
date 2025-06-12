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
        $poczatekMiesiaca = Carbon::now()->startOfMonth();
        $koniecMiesiaca = Carbon::now()->endOfMonth();
        $thirtyDaysAgo = Carbon::now()->subDays(29)->startOfDay(); // Obejmuje dzisiejszy dzień

        // 1. Liczba wystawionych książek (ebooków) przez TEGO dostawcę
        $wystawioneKsiazki = Ebook::where('uzytkownik_id', $idUzytkownika)->count();

        // 2. Sprzedanych w tym miesiącu i Zysk w tym miesiącu
        $daneSprzedazyMiesiac = DB::table('ebook_zamowienie')
            ->join('ebooki', 'ebook_zamowienie.ebook_id', '=', 'ebooki.id')
            ->join('zamowienia', 'ebook_zamowienie.zamowienie_id', '=', 'zamowienia.id')
            ->where('ebooki.uzytkownik_id', $idUzytkownika)
            ->whereBetween('zamowienia.data_zamowienia', [$poczatekMiesiaca, $koniecMiesiaca])
            ->where('zamowienia.status', 'zrealizowane') // Zmieniono na 'zrealizowane' dla spójności
            ->select('ebook_zamowienie.cena_jednostkowa', 'ebook_zamowienie.ilosc')
            ->get();

        $sprzedanychWtymMiesiacu = 0;
        $zyskWtymMiesiacu = 0;
        foreach ($daneSprzedazyMiesiac as $item) {
            $ilosc = $item->ilosc ?? 1;
            $sprzedanychWtymMiesiacu += $ilosc;
            $zyskWtymMiesiacu += ($item->cena_jednostkowa * $ilosc);
        }

        // 3. DANE DO WYKRESU SPRZEDAŻY (OSTATNIE 30 DNI) DLA TEGO DOSTAWCY
        $salesByDayForProvider = DB::table('ebook_zamowienie')
            ->join('ebooki', 'ebook_zamowienie.ebook_id', '=', 'ebooki.id')
            ->join('zamowienia', 'ebook_zamowienie.zamowienie_id', '=', 'zamowienia.id')
            ->select(
                DB::raw('DATE(zamowienia.data_zamowienia) as date'),
                DB::raw('SUM(ebook_zamowienie.cena_jednostkowa * ebook_zamowienie.ilosc) as total')
            )
            ->where('ebooki.uzytkownik_id', $idUzytkownika) // Ogranicz do tego dostawcy
            ->where('zamowienia.data_zamowienia', '>=', $thirtyDaysAgo)
            ->where('zamowienia.status', 'zrealizowane')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->keyBy('date');

        $salesChartData = [];
        $salesChartLabels = [];
        for ($i = 0; $i < 30; $i++) {
            $date = $thirtyDaysAgo->copy()->addDays($i);
            $dateString = $date->toDateString();
            $salesChartLabels[] = $date->format('d.m');
            $salesChartData[] = $salesByDayForProvider->get($dateString)->total ?? 0;
        }

        // 4. TOP 5 E-booków TEGO DOSTAWCY (najlepiej sprzedające się w tym miesiącu)
        $topEbooksForProvider = DB::table('ebook_zamowienie')
            ->join('ebooki', 'ebook_zamowienie.ebook_id', '=', 'ebooki.id')
            ->select('ebooki.tytul', DB::raw('COUNT(ebook_zamowienie.ebook_id) as total_sold'))
            ->where('ebooki.uzytkownik_id', $idUzytkownika) // Ogranicz do tego dostawcy
            ->where('ebook_zamowienie.created_at', '>=', $poczatekMiesiaca)
            ->groupBy('ebooki.tytul')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'publishedBooks' => $wystawioneKsiazki,
            'soldThisMonth' => $sprzedanychWtymMiesiacu,
            'profitThisMonth' => number_format($zyskWtymMiesiacu, 2, '.', '') . ' zł', // Formatuj tu
            'salesChart' => [
                'labels' => $salesChartLabels,
                'data' => $salesChartData,
            ],
            'topEbooks' => $topEbooksForProvider,
        ], 200);
    }
}
