<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\KodResetowaniaHasla;
use Illuminate\Http\Request;
use App\Models\Uzytkownik;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function rejestracja(Request $request)
    {
        $dane = $request->all();

        $validator = Validator::make($dane, [
            'imie' => 'required|string|max:255',
            'nazwisko' => 'required|string|max:255',
            'email' => 'required|email|unique:uzytkownicy,email',
            'haslo' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $uzytkownik = Uzytkownik::create([
            'imie' => $dane['imie'],
            'nazwisko' => $dane['nazwisko'],
            'email' => $dane['email'],
            'haslo' => Hash::make($dane['haslo']),
            'rola' => 'klient',
            'status' => 'aktywny',
        ]);

        return response()->json(['komunikat' => 'Rejestracja zakończona sukcesem'], 201);
    }

    public function logowanie(Request $request){
        $dane = $request->all();

        $validator = Validator::make($dane, [
            'email' => 'required|email',
            'haslo' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $uzytkownik = Uzytkownik::where('email', $dane['email'])->first();

        if(!$uzytkownik || !Hash::check($dane['haslo'], $uzytkownik->haslo)){
            return response()->json(['komunikat' => 'Nieprawidłowe dane logowanie'], 401);
        }

        $token = $uzytkownik->createToken('token')->plainTextToken;

        return response()->json([
            'komunikat' => 'Zalogowano pomyślnie',
            'token' => $token
        ], 200);


    }


    public function zapomnianeHaslo(Request $request)
    {
        $dane = $request->all();

        $validator = Validator::make($dane, [
            'email' => 'required|email|exists:uzytkownicy,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $dane['email']],
            [
                'token' => Hash::make($token),
                'created_at' => Carbon::now()
            ]
        );

        return response()->json([
            'komunikat' => 'Link do resetu hasła został wysłany',
            'token' => $token // tylko na potrzeby testów – w rzeczywistości byłby wysyłany mailem
        ], 200);
    }



    public function wyslijKodResetujacy(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:uzytkownicy,email',
        ]);

        $kod = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        KodResetowaniaHasla::where('email', $request->email)->delete();

        KodResetowaniaHasla::create([
            'email' => $request->email,
            'kod' => $kod,
            'waznosc' => Carbon::now()->addMinutes(10),
        ]);

        Mail::raw('Twój kod resetowania hasła to: ' . $kod, function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Resetowanie hasła - E-book na wynos');
        });

        return response()->json(['message' => 'Kod został wysłany na e-mail.']);
    }

    public function weryfikujKodResetujacy(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:uzytkownicy,email',
            'kod' => 'required|string',
        ]);

        $kodResetowania = KodResetowaniaHasla::where('email', $request->email)
            ->where('kod', $request->kod)
            ->where('waznosc', '>', Carbon::now())
            ->first();

        if (!$kodResetowania) {
            return response()->json(['message' => 'Nieprawidłowy lub wygasły kod.'], 400);
        }

        return response()->json(['message' => 'Kod jest poprawny.']);
    }

    public function resetHasla(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:uzytkownicy,email',
            'kod' => 'required|string',
            'haslo' => 'required|string|min:6|confirmed',
        ]);

        $kodResetowania = KodResetowaniaHasla::where('email', $request->email)
            ->where('kod', $request->kod)
            ->where('waznosc', '>', Carbon::now())
            ->first();

        if (!$kodResetowania) {
            return response()->json(['message' => 'Nieprawidłowy lub wygasły kod.'], 400);
        }

        $uzytkownik = Uzytkownik::where('email', $request->email)->first();
        $uzytkownik->haslo = Hash::make($request->haslo);
        $uzytkownik->save();

        // Usuwamy kod resetowania
        $kodResetowania->delete();

        return response()->json(['message' => 'Hasło zostało zmienione.']);
    }

    public function aktualizujProfil(Request $request)
    {
        $uzytkownik = $request->user();

        $request->validate([
            'imie' => 'required|string|min:2|max:30',
            'nazwisko' => 'required|string|min:2|max:40',
            'email' => 'required|email|max:60|unique:uzytkownicy,email,' . $uzytkownik->id,
        ]);

        $uzytkownik->update([
            'imie' => $request->imie,
            'nazwisko' => $request->nazwisko,
            'email' => $request->email,
        ]);

        return response()->json(['message' => 'Dane profilu zostały zaktualizowane.']);
    }

    public function zmienHaslo(Request $request)
    {
        $request->validate([
            'stare_haslo' => 'required|string',
            'nowe_haslo' => 'required|string|min:6|confirmed',
        ]);

        $uzytkownik = $request->user();

        if (!Hash::check($request->stare_haslo, $uzytkownik->haslo)) {
            return response()->json(['message' => 'Stare hasło jest nieprawidłowe.'], 400);
        }

        $uzytkownik->haslo = Hash::make($request->nowe_haslo);
        $uzytkownik->save();

        return response()->json(['message' => 'Hasło zostało zmienione.']);
    }

}
