<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use App\Models\Ebook;
use App\Models\Zamowienie;
use App\Models\Uzytkownik;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function statystykaDostawcy(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
        ]);

        $dostawcaId = $request->user()->id;

        $startDate = isset($validated['start_date']) ? Carbon::parse($validated['start_date'])->startOfDay() : now()->subDays(29)->startOfDay();
        $endDate = isset($validated['end_date']) ? Carbon::parse($validated['end_date'])->endOfDay() : now()->endOfDay();

        $ebookIds = Ebook::where('uzytkownik_id', $dostawcaId)->pluck('id');


        $transactionsQuery = DB::table('ebook_zamowienie')
            ->whereIn('ebook_id', $ebookIds)
            ->whereBetween('created_at', [$startDate, $endDate]);


        $profitInRange = (clone $transactionsQuery)->sum(DB::raw('cena_jednostkowa * ilosc'));
        $soldInRange = (clone $transactionsQuery)->sum('ilosc');

        $topEbooksInRange = DB::table('ebook_zamowienie')
            ->join('ebooki', 'ebook_zamowienie.ebook_id', '=', 'ebooki.id')
            ->select('ebooki.tytul', DB::raw('SUM(ebook_zamowienie.ilosc) as total_sold'))
            ->whereIn('ebook_zamowienie.ebook_id', $ebookIds)
            ->whereBetween('ebook_zamowienie.created_at', [$startDate, $endDate])
            ->groupBy('ebooki.tytul')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        $salesByDay = (clone $transactionsQuery)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(cena_jednostkowa * ilosc) as total')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->keyBy('date');

        $period = CarbonPeriod::create($startDate, $endDate);
        $salesChartLabels = [];
        $salesChartData = [];

        foreach ($period as $date) {
            $dateString = $date->toDateString();
            $salesChartLabels[] = $date->format('d.m');
            $salesChartData[] = $salesByDay[$dateString]->total ?? 0;
        }

        return response()->json([
            'publishedBooks' => $ebookIds->count(),
            'profitInRange' => number_format($profitInRange, 2, '.', ''),
            'soldInRange' => $soldInRange,
            'topEbooks' => $topEbooksInRange,
            'salesChart' => [
                'labels' => $salesChartLabels,
                'data' => $salesChartData,
            ],
        ], 200);
    }
}
