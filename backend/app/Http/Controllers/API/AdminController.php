<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Recenzja;
use App\Models\Uzytkownik;
use App\Models\Ebook; // -> Dodaj import modelu Ebook
use App\Models\Wiadomosc;
use App\Models\Zamowienie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator; // -> Dodaj import Validatora

class AdminController extends Controller
{
    // Metoda do pobierania listy wszystkich użytkowników (już ją masz)
    public function wszyscyUzytkownicy(Request $request)
    {
        // 1. Pobieranie parametrów z zapytania URL (z wartościami domyślnymi)
        $szukaj = $request->query('szukaj', '');
        $sortujWg = $request->query('sortuj_wg', 'created_at');
        $kierunek = $request->query('kierunek', 'desc');

        // Zabezpieczenie - lista dozwolonych kolumn do sortowania
        $dozwoloneKolumny = ['id', 'imie', 'nazwisko', 'email', 'rola', 'status', 'created_at'];
        if (!in_array($sortujWg, $dozwoloneKolumny)) {
            $sortujWg = 'created_at';
        }

        // 2. Budowanie zapytania
        $query = Uzytkownik::query();

        // 3. Dodawanie filtrowania (wyszukiwania)
        if (!empty($szukaj)) {
            // Szukaj w kilku kolumnach jednocześnie
            $query->where(function($q) use ($szukaj) {
                $q->where('imie', 'like', "%{$szukaj}%")
                    ->orWhere('nazwisko', 'like', "%{$szukaj}%")
                    ->orWhere('email', 'like', "%{$szukaj}%");
            });
        }

        // 4. Dodawanie sortowania i paginacji
        $uzytkownicy = $query->orderBy($sortujWg, $kierunek)->paginate(15);

        return response()->json($uzytkownicy);
    }

    public function szczegolyUzytkownika($id)
    {
        $uzytkownik = Uzytkownik::find($id);

        if (!$uzytkownik) {
            return response()->json(['komunikat' => 'Użytkownik nie znaleziony.'], 404);
        }

        return response()->json($uzytkownik);
    }
    // -> NOWA METODA: Pobieranie wszystkich e-booków

    public function wszystkieEbooki(Request $request)
    {
        // 1. Pobieranie parametrów z zapytania
        $szukaj = $request->query('szukaj', '');
        $sortujWg = $request->query('sortuj_wg', 'created_at');
        $kierunek = $request->query('kierunek', 'desc');

        // 2. Zabezpieczenie - ROZSZERZONA lista dozwolonych kolumn do sortowania
        $dozwoloneKolumny = [
            'id', 'tytul', 'cena', 'status', 'created_at',
            'isbn', 'kategoria', 'jezyk', 'format', 'data_wydania'
        ];
        if (!in_array($sortujWg, $dozwoloneKolumny)) {
            $sortujWg = 'created_at';
        }

        // 3. Budowanie zapytania
        $query = Ebook::with('uzytkownik');

        // 4. Dodawanie filtrowania (wyszukiwania) - ROZSZERZONE
        if (!empty($szukaj)) {
            $query->where(function($q) use ($szukaj) {
                $q->where('tytul', 'like', "%{$szukaj}%")
                    ->orWhere('isbn', 'like', "%{$szukaj}%")
                    ->orWhere('kategoria', 'like', "%{$szukaj}%")
                    ->orWhere('jezyk', 'like', "%{$szukaj}%")
                    ->orWhere('format', 'like', "%{$szukaj}%")
                    ->orWhere('data_wydania', 'like', "%{$szukaj}%")
                    ->orWhereHas('uzytkownik', function($userQuery) use ($szukaj) {
                        $userQuery->where('imie', 'like', "%{$szukaj}%")
                            ->orWhere('nazwisko', 'like', "%{$szukaj}%");
                    });
            });
        }

        // 5. Dodawanie sortowania i paginacji
        $ebooki = $query->orderBy($sortujWg, $kierunek)->paginate(15);

        return response()->json($ebooki);
    }
    public function wszystkieRecenzje(Request $request)
    {
        // 1. Pobieranie parametrów
        $szukaj = $request->query('szukaj', '');
        $sortujWg = $request->query('sortuj_wg', 'created_at');
        $kierunek = $request->query('kierunek', 'desc');
        $filtrujOcena = $request->query('filtruj_ocena', ''); // Nowy parametr do filtrowania

        // 2. Dozwolone kolumny do sortowania
        $dozwoloneKolumny = ['id', 'ocena', 'created_at'];
        if (!in_array($sortujWg, $dozwoloneKolumny)) {
            $sortujWg = 'created_at';
        }

        // 3. Budowanie zapytania
        $query = Recenzja::with(['uzytkownik', 'ebook']);

        // 4. Wyszukiwanie
        if (!empty($szukaj)) {
            $query->where(function($q) use ($szukaj) {
                // Szukaj w treści recenzji
                $q->where('tresc', 'like', "%{$szukaj}%")
                    // Szukaj po autorze recenzji
                    ->orWhereHas('uzytkownik', function($userQuery) use ($szukaj) {
                        $userQuery->where('imie', 'like', "%{$szukaj}%")
                            ->orWhere('nazwisko', 'like', "%{$szukaj}%");
                    })
                    // Szukaj po tytule e-booka
                    ->orWhereHas('ebook', function($ebookQuery) use ($szukaj) {
                        $ebookQuery->where('tytul', 'like', "%{$szukaj}%");
                    });
            });
        }

        // 5. Filtrowanie po ocenie
        if (!empty($filtrujOcena)) {
            $query->where('ocena', $filtrujOcena);
        }

        // 6. Sortowanie i paginacja
        $recenzje = $query->orderBy($sortujWg, $kierunek)->paginate(15);

        return response()->json($recenzje);
    }

    // -> NOWA METODA: Usuwanie recenzji
    public function usunRecenzje($id)
    {
        $recenzja = Recenzja::find($id);

        if (!$recenzja) {
            return response()->json(['komunikat' => 'Recenzja nie została znaleziona.'], 404);
        }

        $recenzja->delete();

        return response()->json(['komunikat' => 'Recenzja została usunięta.'], 200);
    }

    // -> NOWA METODA: Zmiana statusu e-booka
    public function zmienStatusEbooka(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:aktywny,wycofany,oczekuje',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $ebook = Ebook::find($id);

        if (!$ebook) {
            return response()->json(['komunikat' => 'E-book nie został znaleziony.'], 404);
        }

        $ebook->status = $request->input('status');
        $ebook->save();

        return response()->json(['komunikat' => 'Status e-booka został zaktualizowany.', 'ebook' => $ebook]);
    }

    public function wszystkieZamowienia(Request $request)
    {
        // 1. Pobieranie parametrów
        $szukaj = $request->query('szukaj', '');
        $sortujWg = $request->query('sortuj_wg', 'created_at');
        $kierunek = $request->query('kierunek', 'desc');
        $filtrujStatus = $request->query('filtruj_status', ''); // Nowy parametr do filtrowania

        // 2. Dozwolone kolumny do sortowania
        $dozwoloneKolumny = ['id', 'suma', 'status', 'created_at'];
        if (!in_array($sortujWg, $dozwoloneKolumny)) {
            $sortujWg = 'created_at';
        }

        // 3. Budowanie zapytania
        $query = Zamowienie::with('uzytkownik');

        // 4. Wyszukiwanie
        if (!empty($szukaj)) {
            $query->where(function($q) use ($szukaj) {
                // Szukaj po ID zamówienia (jeśli szukana fraza jest liczbą)
                if (is_numeric($szukaj)) {
                    $q->where('id', $szukaj);
                }
                // Szukaj po danych klienta (email, imię, nazwisko)
                $q->orWhereHas('uzytkownik', function($userQuery) use ($szukaj) {
                    $userQuery->where('email', 'like', "%{$szukaj}%")
                        ->orWhere('imie', 'like', "%{$szukaj}%")
                        ->orWhere('nazwisko', 'like', "%{$szukaj}%");
                });
            });
        }

        // 5. Filtrowanie po statusie
        if (!empty($filtrujStatus)) {
            $query->where('status', $filtrujStatus);
        }

        // 6. Sortowanie i paginacja
        $zamowienia = $query->orderBy($sortujWg, $kierunek)->paginate(15);

        return response()->json($zamowienia);
    }

    // -> NOWA METODA: Zmiana statusu zamówienia
    public function zmienStatusZamowienia(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:oczekujące,zrealizowane,anulowane',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $zamowienie = Zamowienie::find($id);

        if (!$zamowienie) {
            return response()->json(['komunikat' => 'Zamówienie nie zostało znalezione.'], 404);
        }

        $zamowienie->status = $request->input('status');
        $zamowienie->save();

        // Zwracamy zaktualizowane zamówienie z danymi użytkownika
        $zamowienie->load('uzytkownik');

        return response()->json(['komunikat' => 'Status zamówienia został zaktualizowany.', 'zamowienie' => $zamowienie]);
    }

    public function wszystkieWiadomosci(Request $request)
    {
        // 1. Pobieranie parametrów
        $szukaj = $request->query('szukaj', '');
        $sortujWg = $request->query('sortuj_wg', 'created_at');
        $kierunek = $request->query('kierunek', 'desc');
        $filtrujPrzeczytana = $request->query('filtruj_przeczytana', ''); // Zmieniona nazwa filtra

        // 2. Dozwolone kolumny do sortowania
        $dozwoloneKolumny = ['imie', 'email', 'temat', 'przeczytana', 'created_at']; // Zmiana 'status' na 'przeczytana'
        if (!in_array($sortujWg, $dozwoloneKolumny)) {
            $sortujWg = 'created_at';
        }

        // 3. Budowanie zapytania
        $query = Wiadomosc::query();

        // 4. Wyszukiwanie
        if (!empty($szukaj)) {
            $query->where(function($q) use ($szukaj) {
                $q->where('imie', 'like', "%{$szukaj}%")
                    ->orWhere('email', 'like', "%{$szukaj}%")
                    ->orWhere('temat', 'like', "%{$szukaj}%");
            });
        }

        // 5. Filtrowanie po statusie przeczytania
        if ($filtrujPrzeczytana !== '') { // Sprawdzamy czy parametr istnieje
            $query->where('przeczytana', $filtrujPrzeczytana); // Filtrujemy po 0 lub 1
        }

        // 6. Sortowanie i paginacja
        $wiadomosci = $query->orderBy($sortujWg, $kierunek)->paginate(15);

        return response()->json($wiadomosci);
    }


    public function oznaczJakoPrzeczytana($id)
    {
        $wiadomosc = Wiadomosc::find($id);

        if (!$wiadomosc) {
            return response()->json(['komunikat' => 'Wiadomość nie została znaleziona.'], 404);
        }

        $wiadomosc->przeczytana = 1; // Ustawiamy wartość na 1
        $wiadomosc->save();

        return response()->json(['komunikat' => 'Wiadomość oznaczona jako przeczytana.', 'wiadomosc' => $wiadomosc]);
    }

    // -> NOWA METODA: Usuwanie wiadomości
    public function usunWiadomosc($id)
    {
        $wiadomosc = Wiadomosc::find($id);

        if (!$wiadomosc) {
            return response()->json(['komunikat' => 'Wiadomość nie została znaleziona.'], 404);
        }

        $wiadomosc->delete();

        return response()->json(['komunikat' => 'Wiadomość została usunięta.'], 200);
    }
}
