<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Koszyk;
use Illuminate\Http\Request;
use App\Models\Zamowienie;
use Illuminate\Support\Facades\DB;
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

    public function historia(Request $request)
    {
        $query = Zamowienie::withCount('ebooki')
            ->orderBy('created_at', 'desc');

        if ($request->user()->rola !== 'admin') {
            $query->where('uzytkownik_id', $request->user()->id);
        }

        return response()->json($query->get());
    }

    public function finalizujZamowienie(Request $request)
    {
        $uzytkownik = $request->user();
        $koszykItems = Koszyk::where('uzytkownik_id', $uzytkownik->id)->with('ebook')->get();

        if ($koszykItems->isEmpty()) {
            return response()->json(['komunikat' => 'Twój koszyk jest pusty.'], 400);
        }


        try {
            DB::beginTransaction();


            $suma = $koszykItems->sum(function ($item) {
                return $item->ebook->cena_promocyjna ?? $item->ebook->cena;
            });


            $zamowienie = Zamowienie::create([
                'uzytkownik_id' => $uzytkownik->id,
                'suma' => $suma,
                'status' => 'zrealizowane',
            ]);


            $daneDoPowiazania = [];
            foreach ($koszykItems as $item) {
                $cenaWchwiliZakupu = $item->ebook->cena_promocyjna ?? $item->ebook->cena;
                $daneDoPowiazania[$item->ebook_id] = ['cena_jednostkowa' => $cenaWchwiliZakupu];
            }


            $zamowienie->ebooki()->attach($daneDoPowiazania);


            Koszyk::where('uzytkownik_id', $uzytkownik->id)->delete();

            DB::commit();

            return response()->json([
                'komunikat' => 'Zamówienie zostało pomyślnie złożone!',
                'zamowienie_id' => $zamowienie->id
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'komunikat' => 'Wystąpił błąd podczas przetwarzania zamówienia.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function historiaZamowien(Request $request)
    {
        $zamowienia = $request->user()->zamowienia()
            ->with('ebooki')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($zamowienia);
    }

    public function szczegolyZamowienia(Request $request, Zamowienie $zamowienie)
    {
        if ($request->user()->id !== $zamowienie->uzytkownik_id) {
            return response()->json(['komunikat' => 'Brak dostępu'], 403);
        }

        $zamowienie->load('ebooki', 'uzytkownik');

        return response()->json($zamowienie);
    }
}
