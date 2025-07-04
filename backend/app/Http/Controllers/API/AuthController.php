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
            'token' => $token,
            'user' => [
                'id' => $uzytkownik->id,
                'imie' => $uzytkownik->imie,
                'nazwisko' => $uzytkownik->nazwisko,
                'email' => $uzytkownik->email,
                'numer_telefonu' => $uzytkownik->numer_telefonu,
                'rola' => $uzytkownik->rola,
                'zdjecie_profilowe' => $uzytkownik->zdjecie_profilowe,
            ]
        ], 200);
    }

    public function zapomnianeHaslo(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:uzytkownicy,email',
        ]);

        $email = $request->email;
        $kod = rand(100000, 999999);
        $waznosc = now()->addMinutes(10);

        KodResetowaniaHasla::where('email', $email)->delete();

        KodResetowaniaHasla::create([
            'email' => $email,
            'kod' => $kod,
            'waznosc' => $waznosc,
        ]);

        Mail::to($email)->send(new ResetHaslaMail($kod));

        return response()->json([
            'komunikat' => 'Kod został wysłany na e-mail.',
        ]);
    }

    public function wyslijKodResetujacy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:uzytkownicy,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Nie znaleziono użytkownika z podanym adresem e-mail.'], 422);
        }

        $email = $request->email;
        $kod = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        \App\Models\KodResetowaniaHasla::where('email', $email)->delete();
        \App\Models\KodResetowaniaHasla::create([
            'email' => $email,
            'kod' => $kod,
            'waznosc' => \Carbon\Carbon::now()->addMinutes(10),
        ]);

        try {
            \Illuminate\Support\Facades\Mail::raw('Twój kod do zresetowania hasła to: ' . $kod, function ($message) use ($email) {
                $message->to($email)->subject('Resetowanie hasła - E-book na wynos');
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Błąd wysyłki e-maila resetującego: ' . $e->getMessage());
            return response()->json(['message' => 'Nie udało się wysłać e-maila. Prosimy spróbować później.'], 500);
        }

        return response()->json(['message' => 'Kod został wysłany na podany adres e-mail.']);
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

        $kodResetowania->delete();

        return response()->json(['message' => 'Hasło zostało zmienione.']);
    }

    public function aktualizujProfil(Request $request)
    {
        $uzytkownik = $request->user();

        if (!$uzytkownik) {
            return response()->json(['message' => 'Użytkownik nieautoryzowany.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'imie' => 'required|string|min:2|max:30',
            'nazwisko' => 'required|string|min:2|max:40',
            'email' => 'required|email|max:60|unique:uzytkownicy,email,' . $uzytkownik->id,
            'numer_telefonu' => 'nullable|string|min:7|max:13',
            'profilePic' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }



        $uzytkownik->update([
            'imie' => $request->imie,
            'nazwisko' => $request->nazwisko,
            'email' => $request->email,
            'numer_telefonu' => $request->numer_telefonu,
            'zdjecie_profilowe' => $request->profilePic,
        ]);

        return response()->json([
            'message' => 'Dane profilu zostały zaktualizowane.',
            'user' => [
                'id' => $uzytkownik->id,
                'imie' => $uzytkownik->imie,
                'nazwisko' => $uzytkownik->nazwisko,
                'email' => $uzytkownik->email,
                'rola' => $uzytkownik->rola,
                'numer_telefonu' => $uzytkownik->numer_telefonu,
                'profilePic' => $uzytkownik->zdjecie_profilowe,
            ]
        ]);
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
