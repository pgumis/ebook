<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Recenzja;
use App\Models\Zamowienie;

class RecenzjaController extends Controller
{
    public function dodaj(Request $request)
    {
        $request->validate([
            'ebook_id' => 'required|exists:ebooki,id',
            'ocena' => 'required|integer|min:1|max:5',
            'tresc' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();

        // Sprawdzenie, czy użytkownik kupił e-booka
        $kupil = Zamowienie::where('uzytkownik_id', $user->id)
            ->whereHas('ebooki', function ($q) use ($request) {
                $q->where('ebooki.id', $request->ebook_id);
            })
            ->exists();

        if (!$kupil) {
            return response()->json(['error' => 'Można oceniać tylko zakupione e-booki.'], 403);
        }

        // Sprawdzenie, czy recenzja już istnieje
        $istnieje = Recenzja::where('uzytkownik_id', $user->id)
            ->where('ebook_id', $request->ebook_id)
            ->exists();

        if ($istnieje) {
            return response()->json(['error' => 'Już dodałeś recenzję.'], 409);
        }

        $recenzja = Recenzja::create([
            'uzytkownik_id' => $user->id,
            'ebook_id' => $request->ebook_id,
            'ocena' => $request->ocena,
            'tresc' => $request->tresc,
        ]);

        return response()->json($recenzja, 201);
    }

    public function edytuj(Request $request, $id)
    {
        $recenzja = Recenzja::find($id);

        if (!$recenzja) {
            return response()->json(['error' => 'Recenzja nie istnieje.'], 404);
        }

        if ($recenzja->uzytkownik_id !== $request->user()->id) {
            return response()->json(['error' => 'Brak dostępu do edycji tej recenzji.'], 403);
        }

        $request->validate([
            'ocena' => 'sometimes|integer|min:1|max:5',
            'tresc' => 'nullable|string|max:1000',
        ]);

        $recenzja->update($request->only(['ocena', 'tresc']));

        return response()->json(['komunikat' => 'Recenzja została zaktualizowana.', 'recenzja' => $recenzja]);
    }

    public function usun(Request $request, $id)
    {
        $recenzja = Recenzja::find($id);

        if (!$recenzja) {
            return response()->json(['error' => 'Recenzja nie istnieje.'], 404);
        }

        if ($recenzja->uzytkownik_id !== $request->user()->id) {
            return response()->json(['error' => 'Brak dostępu do usunięcia tej recenzji.'], 403);
        }

        $recenzja->delete();

        return response()->json(['komunikat' => 'Recenzja została usunięta.']);
    }

    public function lista($id)
    {
        $recenzje = Recenzja::where('ebook_id', $id)
            ->with('uzytkownik:id,imie,nazwisko')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($recenzje);
    }

    public function sprawdzMozliwoscRecenzji(Request $request, $ebook_id)
    {
        $user = $request->user();

        // Sprawdzenie, czy użytkownik kupił e-booka (ta sama logika co w metodzie dodaj)
        $kupil = Zamowienie::where('uzytkownik_id', $user->id)
            ->whereHas('ebooki', function ($q) use ($ebook_id) {
                $q->where('ebooki.id', $ebook_id);
            })
            ->exists();

        // Sprawdzenie, czy już nie dodał recenzji
        $dodalRecenzje = Recenzja::where('uzytkownik_id', $user->id)
            ->where('ebook_id', $ebook_id)
            ->exists();

        // Zwróć prostą odpowiedź, którą frontend łatwo zrozumie true lub false
        return response()->json([
            'mozeRecenzowac' => $kupil && !$dodalRecenzje
        ]);
    }

}
