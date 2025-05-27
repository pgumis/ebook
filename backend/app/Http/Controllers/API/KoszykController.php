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

        $suma = $pozycje->sum(function ($pozycja) {
            return $pozycja->cena_jednostkowa;
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

        if ($ebook->status !== 'aktywny') {
            return response()->json(['komunikat' => 'Ten e-book jest niedostępny.'], 400);
        }

        $cena = $ebook->cena_promocyjna ?? $ebook->cena;

        $istnieje = Koszyk::where('uzytkownik_id', $request->user()->id)
            ->where('ebook_id', $ebook->id)
            ->exists();

        if ($istnieje) {
            return response()->json(['komunikat' => 'Ten e-book już znajduje się w koszyku.'], 409);
        }

        $pozycja = Koszyk::create([
            'uzytkownik_id' => $request->user()->id,
            'ebook_id' => $ebook->id,
            'cena_jednostkowa' => $cena,
        ]);

        return response()->json([
            'komunikat' => 'E-book został dodany do koszyka',
            'pozycja' => $pozycja
        ], 201);
    }


    public function usun($id, Request $request)
    {
        $pozycja = Koszyk::find($id);

        if (!$pozycja) {
            return response()->json(['komunikat' => 'Pozycja nie istnieje.'], 404);
        }

        if ($pozycja->uzytkownik_id !== $request->user()->id) {
            return response()->json(['komunikat' => 'Brak uprawnień.'], 403);
        }

        $pozycja->delete();

        return response()->json(['komunikat' => 'Pozycja została usunięta z koszyka.']);
    }


}
