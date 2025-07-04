<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Recenzja;
use App\Models\Uzytkownik;
use App\Models\Ebook;
use App\Models\Wiadomosc;
use App\Models\Zamowienie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function wszyscyUzytkownicy(Request $request)
    {

        $szukaj = $request->query('szukaj', '');
        $sortujWg = $request->query('sortuj_wg', 'created_at');
        $kierunek = $request->query('kierunek', 'desc');

        $dozwoloneKolumny = ['id', 'imie', 'nazwisko', 'email', 'rola', 'status', 'created_at'];
        if (!in_array($sortujWg, $dozwoloneKolumny)) {
            $sortujWg = 'created_at';
        }

        $query = Uzytkownik::query();

        if (!empty($szukaj)) {
            $query->where(function($q) use ($szukaj) {
                $q->where('imie', 'like', "%{$szukaj}%")
                    ->orWhere('nazwisko', 'like', "%{$szukaj}%")
                    ->orWhere('email', 'like', "%{$szukaj}%");
            });
        }

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

    public function wszystkieEbooki(Request $request)
    {
        $szukaj = $request->query('szukaj', '');
        $sortujWg = $request->query('sortuj_wg', 'created_at');
        $kierunek = $request->query('kierunek', 'desc');

        $dozwoloneKolumny = [
            'id', 'tytul', 'cena', 'status', 'created_at',
            'isbn', 'kategoria', 'jezyk', 'format', 'data_wydania'
        ];
        if (!in_array($sortujWg, $dozwoloneKolumny)) {
            $sortujWg = 'created_at';
        }

        $query = Ebook::with('uzytkownik');

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

        $ebooki = $query->orderBy($sortujWg, $kierunek)->paginate(15);

        return response()->json($ebooki);
    }

    public function wszystkieRecenzje(Request $request)
    {
        $szukaj = $request->query('szukaj', '');
        $sortujWg = $request->query('sortuj_wg', 'created_at');
        $kierunek = $request->query('kierunek', 'desc');
        $filtrujOcena = $request->query('filtruj_ocena', ''); // Nowy parametr do filtrowania

        $dozwoloneKolumny = ['id', 'ocena', 'created_at'];
        if (!in_array($sortujWg, $dozwoloneKolumny)) {
            $sortujWg = 'created_at';
        }

        $query = Recenzja::with(['uzytkownik', 'ebook']);

        if (!empty($szukaj)) {
            $query->where(function($q) use ($szukaj) {
                $q->where('tresc', 'like', "%{$szukaj}%")
                    ->orWhereHas('uzytkownik', function($userQuery) use ($szukaj) {
                        $userQuery->where('imie', 'like', "%{$szukaj}%")
                            ->orWhere('nazwisko', 'like', "%{$szukaj}%");
                    })
                    ->orWhereHas('ebook', function($ebookQuery) use ($szukaj) {
                        $ebookQuery->where('tytul', 'like', "%{$szukaj}%");
                    });
            });
        }

        if (!empty($filtrujOcena)) {
            $query->where('ocena', $filtrujOcena);
        }

        $recenzje = $query->orderBy($sortujWg, $kierunek)->paginate(15);

        return response()->json($recenzje);
    }

    public function usunRecenzje($id)
    {
        $recenzja = Recenzja::find($id);

        if (!$recenzja) {
            return response()->json(['komunikat' => 'Recenzja nie została znaleziona.'], 404);
        }

        $recenzja->delete();

        return response()->json(['komunikat' => 'Recenzja została usunięta.'], 200);
    }

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
        $szukaj = $request->query('szukaj', '');
        $sortujWg = $request->query('sortuj_wg', 'created_at');
        $kierunek = $request->query('kierunek', 'desc');
        $filtrujStatus = $request->query('filtruj_status', ''); // Nowy parametr do filtrowania

        $dozwoloneKolumny = ['id', 'suma', 'status', 'created_at'];
        if (!in_array($sortujWg, $dozwoloneKolumny)) {
            $sortujWg = 'created_at';
        }

        $query = Zamowienie::with('uzytkownik');

        if (!empty($szukaj)) {
            $query->where(function($q) use ($szukaj) {
                if (is_numeric($szukaj)) {
                    $q->where('id', $szukaj);
                }
                $q->orWhereHas('uzytkownik', function($userQuery) use ($szukaj) {
                    $userQuery->where('email', 'like', "%{$szukaj}%")
                        ->orWhere('imie', 'like', "%{$szukaj}%")
                        ->orWhere('nazwisko', 'like', "%{$szukaj}%");
                });
            });
        }

        if (!empty($filtrujStatus)) {
            $query->where('status', $filtrujStatus);
        }

        $zamowienia = $query->orderBy($sortujWg, $kierunek)->paginate(15);

        return response()->json($zamowienia);
    }

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

        $zamowienie->load('uzytkownik');

        return response()->json(['komunikat' => 'Status zamówienia został zaktualizowany.', 'zamowienie' => $zamowienie]);
    }

    public function wszystkieWiadomosci(Request $request)
    {
        $szukaj = $request->query('szukaj', '');
        $sortujWg = $request->query('sortuj_wg', 'created_at');
        $kierunek = $request->query('kierunek', 'desc');
        $filtrujPrzeczytana = $request->query('filtruj_przeczytana', '');

        $dozwoloneKolumny = ['imie', 'email', 'temat', 'przeczytana', 'created_at'];
        if (!in_array($sortujWg, $dozwoloneKolumny)) {
            $sortujWg = 'created_at';
        }

        $query = Wiadomosc::query();

        if (!empty($szukaj)) {
            $query->where(function($q) use ($szukaj) {
                $q->where('imie', 'like', "%{$szukaj}%")
                    ->orWhere('email', 'like', "%{$szukaj}%")
                    ->orWhere('temat', 'like', "%{$szukaj}%");
            });
        }

        if ($filtrujPrzeczytana !== '') {
            $query->where('przeczytana', $filtrujPrzeczytana);
        }

        $wiadomosci = $query->orderBy($sortujWg, $kierunek)->paginate(15);

        return response()->json($wiadomosci);
    }

    public function oznaczJakoPrzeczytana($id)
    {
        $wiadomosc = Wiadomosc::find($id);

        if (!$wiadomosc) {
            return response()->json(['komunikat' => 'Wiadomość nie została znaleziona.'], 404);
        }

        $wiadomosc->przeczytana = 1;
        $wiadomosc->save();

        return response()->json(['komunikat' => 'Wiadomość oznaczona jako przeczytana.', 'wiadomosc' => $wiadomosc]);
    }

    public function usunWiadomosc($id)
    {
        $wiadomosc = Wiadomosc::find($id);

        if (!$wiadomosc) {
            return response()->json(['komunikat' => 'Wiadomość nie została znaleziona.'], 404);
        }

        $wiadomosc->delete();

        return response()->json(['komunikat' => 'Wiadomość została usunięta.'], 200);
    }

    public function zmienRolaUzytkownika(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rola' => 'required|string|in:klient,dostawca,admin,wlasciciel',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $uzytkownik = Uzytkownik::find($id);

        if (!$uzytkownik) {
            return response()->json(['komunikat' => 'Użytkownik nie został znaleziony.'], 404);
        }

        $uzytkownik->rola = $request->input('rola');
        $uzytkownik->save();

        return response()->json(['komunikat' => 'Rola użytkownika została zaktualizowana.', 'uzytkownik' => $uzytkownik]);
    }

    public function aktualizujUzytkownika(Request $request, $id)
    {
        $uzytkownik = Uzytkownik::find($id);
        if (!$uzytkownik) {
            return response()->json(['komunikat' => 'Użytkownik nie znaleziony.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'imie' => 'sometimes|required|string|max:255',
            'nazwisko' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:uzytkownicy,email,' . $id,
            'numer_telefonu' => 'nullable|string|max:20',
            'rola' => 'sometimes|required|string|in:klient,dostawca,admin,wlasciciel',
            'status' => 'sometimes|required|string|in:aktywny,nieaktywny,zablokowany',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Błąd walidacji', 'errors' => $validator->errors()], 422);
        }

        $uzytkownik->fill($request->only(['imie', 'nazwisko', 'email', 'numer_telefonu', 'rola', 'status']));
        $uzytkownik->save();

        return response()->json([
            'message' => 'Dane użytkownika zostały zaktualizowane.',
            'user' => $uzytkownik
        ], 200);
    }
}
