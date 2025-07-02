<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Zamowienie;
use App\Models\Uzytkownik;
use App\Models\Ebook;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OwnerDashboardController extends Controller
{
    /**
     * Zwraca kluczowe wskaźniki wydajności (KPI) dla głównego pulpitu właściciela.
     */
    public function getMainDashboardStats(Request $request)
    {
        // Okresy czasowe
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $startOfYear = Carbon::now()->startOfYear();

        // 1. Całkowity przychód
        $totalRevenue = Zamowienie::where('status', 'zrealizowane')->sum('suma');

        // 2. Przychód w tym miesiącu
        $monthlyRevenue = Zamowienie::where('status', 'zrealizowane')
            ->whereBetween('created_at', [$startOfMonth, Carbon::now()])
            ->sum('suma');

        // 3. Liczba wszystkich użytkowników i podział na role
        $usersCount = Uzytkownik::count();
        $usersByRole = Uzytkownik::select('rola', DB::raw('count(*) as total'))
            ->groupBy('rola')
            ->pluck('total', 'rola');

        // 4. Nowi użytkownicy w tym miesiącu
        $newUsersThisMonth = Uzytkownik::where('created_at', '>=', $startOfMonth)->count();

        // 5. Całkowita liczba e-booków w bazie
        $totalEbooks = Ebook::count();

        // 6. Liczba zrealizowanych zamówień dzisiaj
        $ordersToday = Zamowienie::where('status', 'zrealizowane')
            ->whereBetween('created_at', [Carbon::today()->startOfDay(), Carbon::today()->endOfDay()])
            ->count();

        return response()->json([
            'kpi' => [
                'totalRevenue' => number_format($totalRevenue, 2, ',', ' ') . ' zł',
                'monthlyRevenue' => number_format($monthlyRevenue, 2, ',', ' ') . ' zł',
                'totalUsers' => $usersCount,
                'newUsersThisMonth' => $newUsersThisMonth,
                'totalEbooks' => $totalEbooks,
                'ordersToday' => $ordersToday,
            ],
            'usersByRole' => $usersByRole,
        ]);
    }

    public function getSalesAnalysis(Request $request)
    {
        $request->validate([
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
        ]);

        $startDate = Carbon::parse($request->input('startDate'))->startOfDay();
        $endDate = Carbon::parse($request->input('endDate'))->endOfDay();

        $ordersQuery = Zamowienie::where('status', 'zrealizowane')
            ->whereBetween('created_at', [$startDate, $endDate]);

        // Obliczenia KPI
        $totalRevenue = (clone $ordersQuery)->sum('suma');
        $totalOrders = (clone $ordersQuery)->count();
        $averageOrderValue = ($totalOrders > 0) ? $totalRevenue / $totalOrders : 0;

        // Obliczenie sprzedanych e-booków
        $orderIds = (clone $ordersQuery)->pluck('id');
        $totalEbooksSold = DB::table('ebook_zamowienie')->whereIn('zamowienie_id', $orderIds)->sum('ilosc');

        // Dane do wykresu "Sprzedaż w czasie"
        $salesData = (clone $ordersQuery)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(suma) as total'))
            ->groupBy('date')->orderBy('date', 'asc')->get()->keyBy('date');

        $period = \Carbon\CarbonPeriod::create($startDate, $endDate);
        $salesOverTimeLabels = [];
        $salesOverTimeData = [];
        foreach ($period as $date) {
            $dateString = $date->toDateString();
            $salesOverTimeLabels[] = $date->format('d.m');
            $saleOnDay = $salesData->get($dateString);
            $salesOverTimeData[] = $saleOnDay ? $saleOnDay->total : 0;
        }

        // Pozostałe dane analityczne
        $salesByDayOfWeek = (clone $ordersQuery)->select(DB::raw('DAYOFWEEK(created_at) as day_of_week'), DB::raw('SUM(suma) as total'))->groupBy('day_of_week')->get()->pluck('total', 'day_of_week');
        $salesByHour = (clone $ordersQuery)->select(DB::raw('HOUR(created_at) as hour'), DB::raw('SUM(suma) as total'))->groupBy('hour')->get()->pluck('total', 'hour');
        $topSellingEbooks = DB::table('ebook_zamowienie')->join('zamowienia', 'ebook_zamowienie.zamowienie_id', '=', 'zamowienia.id')->join('ebooki', 'ebook_zamowienie.ebook_id', '=', 'ebooki.id')->where('zamowienia.status', 'zrealizowane')->whereBetween('zamowienia.created_at', [$startDate, $endDate])->select('ebooki.tytul', DB::raw('SUM(ebook_zamowienie.ilosc) as total_sold'))->groupBy('ebooki.tytul')->orderBy('total_sold', 'desc')->limit(10)->get();

        return response()->json([
            'kpi' => [
                'totalRevenue' => round($totalRevenue, 2),
                'totalOrders' => $totalOrders,
                'averageOrderValue' => round($averageOrderValue, 2),
                'totalEbooksSold' => (int)$totalEbooksSold,
            ],
            'salesOverTime' => ['labels' => $salesOverTimeLabels, 'data' => $salesOverTimeData],
            'salesByDayOfWeek' => $salesByDayOfWeek,
            'salesByHour' => $salesByHour,
            'topSellingEbooks' => $topSellingEbooks,
        ]);
    }

    public function getUsersAnalysis(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
            'sort_by' => 'sometimes|in:total_spent,order_count',
            'direction' => 'sometimes|in:asc,desc',
            'limit' => 'sometimes|integer|min:1|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $startDate = Carbon::parse($request->input('startDate'))->startOfDay();
        $endDate = Carbon::parse($request->input('endDate'))->endOfDay();
        $sortBy = $request->input('sort_by', 'total_spent');
        $direction = $request->input('direction', 'desc');
        $limit = $request->input('limit', 10);

        // Podział użytkowników na role (to zapytanie nie zależy od daty, więc jest OK)
        $usersByRole = Uzytkownik::select('rola', DB::raw('count(*) as total'))
            ->groupBy('rola')
            ->pluck('total', 'rola');

        // Trend rejestracji (teraz używa zakresu dat)
        $registrationTrend = Uzytkownik::select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            // --- ZMIANA ---
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        $topCustomersBySpending = Uzytkownik::join('zamowienia', 'uzytkownicy.id', '=', 'zamowienia.uzytkownik_id')
            ->where('zamowienia.status', 'zrealizowane')
            ->whereBetween('zamowienia.created_at', [$startDate, $endDate])
            ->select(
                'uzytkownicy.imie', 'uzytkownicy.nazwisko', 'uzytkownicy.email',
                DB::raw('SUM(zamowienia.suma) as total_spent'),
                DB::raw('COUNT(zamowienia.id) as order_count')
            )
            ->groupBy('uzytkownicy.id', 'uzytkownicy.imie', 'uzytkownicy.nazwisko', 'uzytkownicy.email')
            ->orderBy($sortBy, $direction) // Użycie dynamicznego sortowania
            ->limit($limit) // Użycie dynamicznego limitu
            ->get();

        $newUsersInPeriod = Uzytkownik::select('rola', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('rola')
            ->pluck('count', 'rola');

        return response()->json([
            'usersByRole' => $usersByRole,
            'registrationTrend' => $registrationTrend,
            'topCustomersBySpending' => $topCustomersBySpending,
            'newUsersInPeriod' => $newUsersInPeriod,
        ]);
    }

    public function getProductsAnalysis(Request $request)
    {
        // Pełna walidacja dla wszystkich możliwych parametrów
        $validator = Validator::make($request->all(), [
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
            'limit_bestsellers' => 'sometimes|integer|min:1|max:50',
            'limit_worst_sellers' => 'sometimes|integer|min:1|max:50',
            'limit_categories' => 'sometimes|integer|min:1|max:50',
            'direction_categories' => 'sometimes|in:asc,desc',
            'limit_vendors' => 'sometimes|integer|min:1|max:50',
            'direction_vendors' => 'sometimes|in:asc,desc',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Pobieranie wszystkich parametrów z requestu
        $startDate = Carbon::parse($request->input('startDate'))->startOfDay();
        $endDate = Carbon::parse($request->input('endDate'))->endOfDay();
        $limitBestsellers = $request->input('limit_bestsellers', 10);
        $limitWorstSellers = $request->input('limit_worst_sellers', 10);
        $limitCategories = $request->input('limit_categories', 10);
        $directionCategories = $request->input('direction_categories', 'desc');
        $limitVendors = $request->input('limit_vendors', 10);
        $directionVendors = $request->input('direction_vendors', 'desc');

        // Zapytania o Bestsellery i Najsłabiej sprzedające się (one mają stałe sortowanie)
        $bestSellingEbooks = DB::table('ebooki')
            ->leftJoin('ebook_zamowienie', 'ebooki.id', '=', 'ebook_zamowienie.ebook_id')
            ->leftJoin('zamowienia', 'ebook_zamowienie.zamowienie_id', '=', 'zamowienia.id')
            ->where('zamowienia.status', 'zrealizowane')->whereBetween('zamowienia.created_at', [$startDate, $endDate])
            ->select('ebooki.tytul', DB::raw('SUM(ebook_zamowienie.ilosc) as total_sold'))
            ->groupBy('ebooki.id', 'ebooki.tytul')->orderBy('total_sold', 'desc')->limit($limitBestsellers)->get();

        $worstSellingEbooks = DB::table('ebooki')
            ->leftJoin('ebook_zamowienie', function ($join) use ($startDate, $endDate) {
                $join->on('ebooki.id', '=', 'ebook_zamowienie.ebook_id')
                    ->leftJoin('zamowienia', 'ebook_zamowienie.zamowienie_id', '=', 'zamowienia.id')
                    ->where('zamowienia.status', 'zrealizowane')->whereBetween('zamowienia.created_at', [$startDate, $endDate]);
            })
            ->where('ebooki.status', 'aktywny')->select('ebooki.tytul', DB::raw('COALESCE(SUM(ebook_zamowienie.ilosc), 0) as total_sold'))
            ->groupBy('ebooki.id', 'ebooki.tytul')->orderBy('total_sold', 'asc')->limit($limitWorstSellers)->get();

        // Zapytania o Kategorie i Dostawców (z dynamicznym sortowaniem i limitem)
        $topCategories = DB::table('ebooki')
            ->join('ebook_zamowienie', 'ebooki.id', '=', 'ebook_zamowienie.ebook_id')
            ->join('zamowienia', 'ebook_zamowienie.zamowienie_id', '=', 'zamowienia.id')
            ->where('zamowienia.status', 'zrealizowane')->whereBetween('zamowienia.created_at', [$startDate, $endDate])
            ->select('ebooki.kategoria', DB::raw('SUM(ebook_zamowienie.cena_jednostkowa * ebook_zamowienie.ilosc) as total_revenue'))
            ->groupBy('ebooki.kategoria')->orderBy('total_revenue', $directionCategories)->limit($limitCategories)->get();

        $topVendors = DB::table('uzytkownicy')
            ->join('ebooki', 'uzytkownicy.id', '=', 'ebooki.uzytkownik_id')
            ->join('ebook_zamowienie', 'ebooki.id', '=', 'ebook_zamowienie.ebook_id')
            ->join('zamowienia', 'ebook_zamowienie.zamowienie_id', '=', 'zamowienia.id')
            ->where('zamowienia.status', 'zrealizowane')->where('uzytkownicy.rola', 'dostawca')
            ->whereBetween('zamowienia.created_at', [$startDate, $endDate])
            ->select('uzytkownicy.imie', 'uzytkownicy.nazwisko', DB::raw('SUM(ebook_zamowienie.cena_jednostkowa * ebook_zamowienie.ilosc) as total_revenue'))
            ->groupBy('uzytkownicy.id', 'uzytkownicy.imie', 'uzytkownicy.nazwisko')->orderBy('total_revenue', $directionVendors)->limit($limitVendors)->get();

        return response()->json([
            'bestSellingEbooks' => $bestSellingEbooks, 'worstSellingEbooks' => $worstSellingEbooks,
            'topCategories' => $topCategories, 'topVendors' => $topVendors,
        ]);
    }

    public function generateReport(Request $request)
    {
        $request->validate([
            'reportType' => 'required|in:sales, users, products',
            'startDate' => 'nullable|date',
            'endDate' => 'nullable|date|after_or_equal:startDate',
        ]);

        $reportType = $request->input('reportType');
        $fileName = "raport_{$reportType}_" . date('Y-m-d') . ".csv";
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = [];
        $query = null;

        // Budowanie zapytania i kolumn w zależności od typu raportu
        if ($reportType === 'sales') {
            $columns = ['ID Zamówienia', 'Data', 'Klient', 'Email Klienta', 'Status', 'Kwota (PLN)'];
            $query = Zamowienie::with('uzytkownik')
                ->select('id', 'created_at', 'uzytkownik_id', 'status', 'suma');

        } elseif ($reportType === 'users') {
            $columns = ['ID Użytkownika', 'Imię', 'Nazwisko', 'Email', 'Rola', 'Data Rejestracji'];
            $query = Uzytkownik::select('id', 'imie', 'nazwisko', 'email', 'rola', 'created_at');
        }
        elseif ($reportType === 'products') {
            $columns = ['ID Ebooka', 'Tytuł', 'Kategoria', 'Cena (PLN)', 'Status', 'Sprzedanych sztuk', 'Całkowity przychód'];
            $query = Ebook::leftJoin('ebook_zamowienie', 'ebooki.id', '=', 'ebook_zamowienie.ebook_id')
                ->leftJoin('zamowienia', 'ebook_zamowienie.zamowienie_id', '=', 'zamowienia.id')
                ->where(function ($q) {
                    $q->where('zamowienia.status', 'zrealizowane')->orWhereNull('zamowienia.id');
                })
                ->select(
                    'ebooki.id', 'ebooki.tytul', 'ebooki.kategoria', 'ebooki.cena', 'ebooki.status',
                    DB::raw('COALESCE(SUM(ebook_zamowienie.ilosc), 0) as total_sold'),
                    DB::raw('COALESCE(SUM(ebook_zamowienie.ilosc * ebook_zamowienie.cena_jednostkowa), 0) as total_revenue')
                )
                ->groupBy('ebooki.id', 'ebooki.tytul', 'ebooki.kategoria', 'ebooki.cena', 'ebooki.status');
        }


        // Filtrowanie po dacie, jeśli podano
        if ($request->filled('startDate') && $request->filled('endDate')) {
            $dateColumn = ($reportType === 'sales') ? 'created_at' : 'created_at';
            $query->whereBetween($dateColumn, [$request->input('startDate'), $request->input('endDate')]);
        }

        $data = $query->get();

        // Callback do streamowania odpowiedzi, aby nie zużywać dużo pamięci
        $callback = function() use($data, $columns, $reportType) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($data as $row) {
                if ($reportType === 'sales') {
                    fputcsv($file, [
                        $row->id,
                        $row->created_at,
                        $row->uzytkownik->imie . ' ' . $row->uzytkownik->nazwisko,
                        $row->uzytkownik->email,
                        $row->status,
                        number_format($row->suma, 2, '.', ''),
                    ]);
                } elseif ($reportType === 'users') {
                    fputcsv($file, [
                        $row->id,
                        $row->imie,
                        $row->nazwisko,
                        $row->email,
                        $row->rola,
                        $row->created_at,
                    ]);
                }
                elseif ($reportType === 'products') {
                    fputcsv($file, [
                        $row->id,
                        $row->tytul,
                        $row->kategoria,
                        number_format($row->cena, 2, '.', ''),
                        $row->status,
                        $row->total_sold,
                        number_format($row->total_revenue, 2, '.', ''),
                    ]);
                }
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
