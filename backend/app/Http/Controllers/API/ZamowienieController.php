<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Zamowienie;
use Illuminate\Support\Facades\Validator;

class ZamowienieController extends Controller
{
    public function lista()
    {
        $zamowienia = Zamowienie::all();

        return response()->json($zamowienia, 200);
    }
    public function dodaj(Request $request)
    {
        $dane = $request->all();

        $validator = Validator::make($dane, [
            'uzytkownik_id' => 'required|exists:uzytkownicy,id',
            'suma' => 'required|numeric|min:0',
            'status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $zamowienie = Zamowienie::create([
            'uzytkownik_id' => $dane['uzytkownik_id'],
            'suma' => $dane['suma'],
            'status' => $dane['status'],
            'data_zamowienia' => now(),
        ]);

        return response()->json([
            'komunikat' => 'Zamówienie zostało utworzone',
            'zamowienie' => $zamowienie
        ], 201);
    }

    public function szczegoly($id)
    {
        $zamowienie = Zamowienie::find($id);

        if (!$zamowienie) {
            return response()->json(['komunikat' => 'Zamówienie nie istnieje'], 404);
        }

        return response()->json($zamowienie, 200);
    }

    public function edytuj(Request $request, $id)
    {
        $zamowienie = Zamowienie::find($id);

        if (!$zamowienie) {
            return response()->json(['komunikat' => 'Zamówienie nie istnieje'], 404);
        }

        $dane = $request->all();

        $validator = Validator::make($dane, [
            'uzytkownik_id' => 'sometimes|exists:uzytkownicy,id',
            'suma' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $zamowienie->update($dane);

        return response()->json([
            'komunikat' => 'Zamówienie zostało zaktualizowane',
            'zamowienie' => $zamowienie
        ], 200);
    }

    public function usun($id)
    {
        $zamowienie = Zamowienie::find($id);

        if (!$zamowienie) {
            return response()->json(['komunikat' => 'Zamówienie nie istnieje'], 404);
        }

        $zamowienie->delete();

        return response()->json(['komunikat' => 'Zamówienie zostało usunięte'], 200);
    }

}
