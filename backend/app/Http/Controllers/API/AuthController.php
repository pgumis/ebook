<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Uzytkownik;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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

        return response()->json(['komunikat' => 'Zalogowano pomyślnie'], 200);
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

    public function resetHasla(Request $request)
    {
        $dane = $request->all();

        $validator = Validator::make($dane, [
            'email' => 'required|email|exists:uzytkownicy,email',
            'token' => 'required',
            'haslo' => 'required|string|min:6|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $rekord = DB::table('password_reset_tokens')
            ->where('email', $dane['email'])
            ->first();

        if (!$rekord || !Hash::check($dane['token'], $rekord->token)) {
            return response()->json(['komunikat' => 'Nieprawidłowy token lub email'], 400);
        }

        $uzytkownik = Uzytkownik::where('email', $dane['email'])->first();
        $uzytkownik->haslo = Hash::make($dane['haslo']);
        $uzytkownik->save();

        DB::table('password_reset_tokens')->where('email', $dane['email'])->delete();

        return response()->json(['komunikat' => 'Hasło zostało zresetowane'], 200);
    }

}
