<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Wiadomosc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WiadomoscController extends Controller
{
    public function dodaj(Request $request)
    {
        $dane = $request->all();

        $validator = Validator::make($dane, [
            'temat' => 'required|string|max:255',
            'tresc' => 'required|string',
            'email' => 'nullable|email',
            'imie' => 'nullable|string|max:255',
            'uzytkownik_id' => 'nullable|exists:uzytkownicy,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $wiadomosc = Wiadomosc::create([
            'temat' => $dane['temat'],
            'tresc' => $dane['tresc'],
            'email' => $dane['email'] ?? null,
            'imie' => $dane['imie'] ?? null,
            'uzytkownik_id' => $dane['uzytkownik_id'] ?? null,
            'przeczytana' => false,
        ]);

        return response()->json([
            'komunikat' => 'Wiadomość została wysłana',
            'wiadomosc' => $wiadomosc
        ], 201);
    }

    public function lista()
    {
        $wiadomosci = Wiadomosc::all();

        return response()->json($wiadomosci, 200);
    }

    public function usun($id)
    {
        $wiadomosc = Wiadomosc::find($id);

        if (!$wiadomosc) {
            return response()->json(['komunikat' => 'Wiadomość nie istnieje'], 404);
        }

        $wiadomosc->delete();

        return response()->json(['komunikat' => 'Wiadomość została usunięta'], 200);
    }

}
