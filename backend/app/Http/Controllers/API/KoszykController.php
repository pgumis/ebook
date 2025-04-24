<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Koszyk;
use Illuminate\Support\Facades\Validator;
class KoszykController extends Controller
{
    public function lista()
    {
        $pozycje = Koszyk::all();

        return response()->json($pozycje, 200);
    }

    public function dodaj(Request $request)
    {
        $dane = $request->all();

        $validator = Validator::make($dane, [
            'uzytkownik_id' => 'required|exists:uzytkownicy,id',
            'ebook_id' => 'required|exists:ebooki,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $pozycja = Koszyk::create([
            'uzytkownik_id' => $dane['uzytkownik_id'],
            'ebook_id' => $dane['ebook_id'],
            'ilosc' => 1
        ]);

        return response()->json([
            'komunikat' => 'E-book został dodany do koszyka',
            'pozycja' => $pozycja
        ], 201);
    }

    public function usun($id)
    {
        $pozycja = Koszyk::find($id);

        if (!$pozycja) {
            return response()->json(['komunikat' => 'Pozycja w koszyku nie istnieje'], 404);
        }

        $pozycja->delete();

        return response()->json(['komunikat' => 'Pozycja została usunięta z koszyka'], 200);
    }

}
