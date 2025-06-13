<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Carbon\CarbonPeriod;
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
        // KROK 1: Walidacja i pobranie zakresu dat z requestu
        $validated = $request->validate([
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
        ]);

        $dostawcaId = $request->user()->id;

        // Jeśli daty nie są podane, domyślnie bierzemy ostatnie 30 dni
        $startDate = isset($validated['start_date']) ? Carbon::parse($validated['start_date'])->startOfDay() : now()->subDays(29)->startOfDay();
        $endDate = isset($validated['end_date']) ? Carbon::parse($validated['end_date'])->endOfDay() : now()->endOfDay();

        // KROK 2: Pobranie ID książek dostawcy (bez zmian)
        $ebookIds = Ebook::where('uzytkownik_id', $dostawcaId)->pluck('id');

        // KROK 3: Główne zapytanie do transakcji, które będziemy reużywać
        // Standaryzujemy na 'ebook_zamowienie.created_at' jako dacie transakcji
        $transactionsQuery = DB::table('ebook_zamowienie')
            ->whereIn('ebook_id', $ebookIds)
            ->whereBetween('created_at', [$startDate, $endDate]);

        // KROK 4: Obliczenie kluczowych wskaźników dla zadanego okresu
        // Klonujemy zapytanie, aby nie modyfikować oryginału
        $profitInRange = (clone $transactionsQuery)->sum(DB::raw('cena_jednostkowa * ilosc'));
        $soldInRange = (clone $transactionsQuery)->sum('ilosc');

        // KROK 5: TOP 5 E-booków w zadanym okresie
        $topEbooksInRange = DB::table('ebook_zamowienie')
            ->join('ebooki', 'ebook_zamowienie.ebook_id', '=', 'ebooki.id')
            ->select('ebooki.tytul', DB::raw('SUM(ebook_zamowienie.ilosc) as total_sold'))
            ->whereIn('ebook_zamowienie.ebook_id', $ebookIds)
            ->whereBetween('ebook_zamowienie.created_at', [$startDate, $endDate])
            ->groupBy('ebooki.tytul')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // KROK 6: Dynamiczne dane do wykresu dla zadanego okresu
        $salesByDay = (clone $transactionsQuery)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(cena_jednostkowa * ilosc) as total')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->keyBy('date'); // Kluczujemy po dacie dla łatwego dostępu

        // Tworzymy etykiety i dane dla każdej daty w zadanym okresie, aby wykres był kompletny
        $period = CarbonPeriod::create($startDate, $endDate);
        $salesChartLabels = [];
        $salesChartData = [];

        foreach ($period as $date) {
            $dateString = $date->toDateString();
            $salesChartLabels[] = $date->format('d.m'); // Etykieta w formacie DD.MM
            $salesChartData[] = $salesByDay[$dateString]->total ?? 0; // Używamy danych lub wstawiamy 0
        }

        // KROK 7: Zwrócenie ujednoliconej odpowiedzi JSON
        return response()->json([
            'publishedBooks' => $ebookIds->count(), // Liczba książek jest stała
            'profitInRange' => number_format($profitInRange, 2, '.', ''), // Zwracamy czystą liczbę
            'soldInRange' => $soldInRange,
            'topEbooks' => $topEbooksInRange,
            'salesChart' => [
                'labels' => $salesChartLabels,
                'data' => $salesChartData,
            ],
        ], 200);
    }
}
