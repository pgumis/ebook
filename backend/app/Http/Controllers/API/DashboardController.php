<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ebook; // Potrzebne do zliczania książek
use App\Models\Zamowienie; // Potrzebne do zliczania sprzedanych i zysku
use Carbon\Carbon; // Do obsługi dat

class DashboardController extends Controller
{
    /**
     * Zwraca statystyki dashboardu dla zalogowanego dostawcy.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProviderStats(Request $request)
    {
        $userId = $request->user()->id; // ID zalogowanego dostawcy

        // 1. Liczba wystawionych książek
        $publishedBooks = Ebook::where('uzytkownik_id', $userId)->count();

        // 2. Sprzedanych w tym miesiącu (liczymy zamówienia ebooków tego dostawcy)
        // Zakładam, że masz model Zamowienie i relację między Zamowieniem a Ebookiem.
        // Będziesz musiał dostosować to zapytanie do swojej struktury bazy danych.
        // Poniżej jest przykład, który wymaga dostosowania.

        // OPCJA A: Jeśli masz pole 'status' w zamówieniach i kolumnę 'uzytkownik_id' w tabeli 'zamowienia_items' (lub podobnej)
        // To jest bardziej złożone i wymaga poprawnych relacji/struktur.
        // Jeśli masz tabelę pośrednią `zamowienia_items` (pivot table dla ebooków w zamówieniach)
        // i ta tabela `zamowienia_items` ma `uzytkownik_id`, to zapytanie będzie prostsze.

        // Zakładam prostszą strukturę na potrzeby przykładu:
        // Że Ebook ma relację 'zamowienia_items', a te items mają status 'completed'
        // i że możesz połączyć Ebook z zamówieniami.

        $currentMonthStart = Carbon::now()->startOfMonth();
        $currentMonthEnd = Carbon::now()->endOfMonth();

        // Najprostsza, ale potencjalnie wymagająca doprecyzowania:
        // Liczba sprzedanych ebooków przez TEGO dostawcę w tym miesiącu
        // WYMAGA ODPOWIEDNIEJ STRUKTURY BAZY DANYCH I RELACJI!
        // Zakładam, że w modelu Ebook masz relację z Zamowieniem
        // lub że w Zamowienie_item masz pole 'uzytkownik_id'

        // Poniższy przykład zakłada, że masz relację Ebook->zamowieniaItems (jeden ebook wiele pozycji zamówień)
        // i każda pozycja zamówienia odnosi się do zamówienia (które ma datę)
        $soldThisMonth = Ebook::where('uzytkownik_id', $userId)
            ->whereHas('zamowieniaItems', function ($query) use ($currentMonthStart, $currentMonthEnd) {
                $query->whereHas('zamowienie', function ($subQuery) use ($currentMonthStart, $currentMonthEnd) {
                    $subQuery->whereBetween('data_zamowienia', [$currentMonthStart, $currentMonthEnd])
                        ->where('status', 'completed'); // Zakładam, że masz kolumnę status
                });
            })
            ->sum('sold_count'); // Załóżmy, że ebook ma kolumnę 'sold_count' sumującą sprzedaż
        // LUB: zliczaj z tabeli zamówień_items

        // LUB: Prostszy przykład, jeśli zamowienia_items mają id_ebooka i id_dostawcy
        $soldThisMonthCount = 0;
        $profitThisMonth = 0;

        // POBIERZ WSZYSTKIE POZYCJE ZAMÓWIEŃ Z TEGO MIESIĄCA DLA TEGO DOSTAWCY
        // To wymaga, aby tabela `zamowienia_items` (lub podobna) miała `ebook_id` i `uzytkownik_id`
        // lub żeby było łatwo dotrzeć do dostawcy z pozycji zamówienia.

        // PRZYKŁAD, JEŚLI MASZ TABELĘ ZAMÓWIEŃ I TABELĘ POZYCJI ZAMÓWIEŃ (OrderItems)
        // I OrderItem ma 'ebook_id' oraz 'price_at_purchase'
        // I Ebook ma 'uzytkownik_id' (czyli id dostawcy)

        // W modelu Ebook:
        // public function orderItems() { return $this->hasMany(OrderItem::class); }
        // W modelu OrderItem:
        // public function ebook() { return $this->belongsTo(Ebook::class); }
        // public function order() { return $this->belongsTo(Order::class); }

        $orderItemsForProviderThisMonth = \App\Models\OrderItem::whereHas('ebook', function ($query) use ($userId) {
            $query->where('uzytkownik_id', $userId);
        })
            ->whereHas('order', function ($query) use ($currentMonthStart, $currentMonthEnd) {
                $query->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
                    ->where('status', 'completed'); // Tylko zakończone zamówienia
            })
            ->get(); // Pobierz wszystkie pozycje

        $soldThisMonthCount = $orderItemsForProviderThisMonth->sum('quantity'); // Sumuj ilości sprzedanych sztuk
        $profitThisMonth = $orderItemsForProviderThisMonth->sum(function($item) {
            return $item->quantity * $item->price_at_purchase; // Sumuj zysk z każdej pozycji
        });

        // Upewnij się, że masz kolumny 'quantity' i 'price_at_purchase' w tabeli OrderItems
        // I odpowiednie modele OrderItem i Order, oraz relacje.

        // 3. Zysk w tym miesiącu
        // To będzie suma cen sprzedanych ebooków przez tego dostawcę w tym miesiącu.
        // Jeśli profitThisMonth jest już obliczone powyżej, użyj go.
        $profitThisMonthFormatted = number_format($profitThisMonth, 2, ',', '') . ' PLN';


        return response()->json([
            'publishedBooks' => $publishedBooks,
            'soldThisMonth' => $soldThisMonthCount,
            'profitThisMonth' => $profitThisMonthFormatted,
        ], 200);
    }
}
