<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Ebook;
use Illuminate\Http\Request;
use App\Models\Koszyk;
use Illuminate\Support\Facades\Validator;
class KoszykController extends Controller
{
    public function widok(Request $request)
    {
        $pozycje = Koszyk::with('ebook')
            ->where('uzytkownik_id', $request->user()->id)
            ->get();

        // -> POPRAWIONA LOGIKA SUMOWANIA
        // Sumujemy ceny z dołączonego modelu Ebook, a nie z tabeli koszyk
        $suma = $pozycje->sum(function ($pozycja) {
            // Sprawdź, czy ebook istnieje, aby uniknąć błędu
            if ($pozycja->ebook) {
                $cena = $pozycja->ebook->cena_promocyjna ?? $pozycja->ebook->cena;
                return $cena * $pozycja->ilosc;
            }
            return 0;
        });

        return response()->json([
            'pozycje' => $pozycje,
            'suma' => $suma,
        ]);
    }


    public function dodaj(Request $request)
    {
        $request->validate([
            'ebook_id' => 'required|exists:ebooki,id',
        ]);

        $ebook = Ebook::find($request->ebook_id);
        $user_id = $request->user()->id;

        if ($ebook->status !== 'aktywny') {
            return response()->json(['komunikat' => 'Ten e-book jest niedostępny.'], 400);
        }

        $istnieje = Koszyk::where('uzytkownik_id', $user_id)
            ->where('ebook_id', $ebook->id)
            ->exists();

        if ($istnieje) {
            return response()->json(['komunikat' => 'Ten e-book już znajduje się w koszyku.'], 409);
        }

        // -> POPRAWIONY ZAPIS DO BAZY
        // Zapisujemy tylko te pola, które istnieją w tabeli 'koszyk'
        $pozycja = Koszyk::create([
            'uzytkownik_id' => $user_id,
            'ebook_id' => $ebook->id,
            'ilosc' => 1, // Zawsze dodajemy 1 sztukę
        ]);

        // Aby odpowiedź była kompletna dla frontendu, dołączamy dane ebooka
        $pozycja->load('ebook');

        return response()->json([
            'komunikat' => 'E-book został dodany do koszyka',
            'pozycja' => $pozycja // Teraz odpowiedź zawiera też info o książce
        ], 201);
    }


    public function usun(Request $request, $ebook_id)
    {
        // Pobierz ID zalogowanego użytkownika
        $uzytkownik_id = $request->user()->id;

        // Znajdź pozycję w koszyku, która należy do TEGO użytkownika
        // i dotyczy TEJ książki. Używamy Twojego modelu 'Koszyk'.
        $pozycjaWKoszyku = Koszyk::where('uzytkownik_id', $uzytkownik_id)
            ->where('ebook_id', $ebook_id)
            ->first();

        // Jeśli znaleziono taką pozycję, usuń ją
        if ($pozycjaWKoszyku) {
            $pozycjaWKoszyku->delete();
            // Zwróć potwierdzenie usunięcia
            return response()->json(['komunikat' => 'Produkt został usunięty z koszyka.'], 200);
        }

        // Jeśli z jakiegoś powodu nie znaleziono, zwróć błąd 404
        return response()->json(['komunikat' => 'Pozycja nie istnieje w koszyku.'], 404);
    }



}
