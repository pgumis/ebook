<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Wiadomosc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WiadomoscController extends Controller
{

    public function lista()
    {
        $wiadomosci = Wiadomosc::all();

        return response()->json($wiadomosci, 200);
    }


    public function wyslij(Request $request)
    {
        if ($request->user()) {

            $request->validate([
                'temat' => 'required|string|min:5|max:100',
                'tresc' => 'required|string|min:20|max:2000',
            ]);

            Wiadomosc::create([
                'uzytkownik_id' => $request->user()->id,
                'temat' => $request->temat,
                'tresc' => $request->tresc,
                'przeczytana' => false,
            ]);
        } else {

            $request->validate([
                'imie' => 'required|string|min:2|max:30',
                'email' => 'required|email|max:60',
                'temat' => 'required|string|min:5|max:100',
                'tresc' => 'required|string|min:20|max:2000',
            ]);

            Wiadomosc::create([
                'imie' => $request->imie,
                'email' => $request->email,
                'temat' => $request->temat,
                'tresc' => $request->tresc,
                'przeczytana' => false,
            ]);
        }

        return response()->json(['message' => 'Wiadomość została wysłana.'], 200);
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
