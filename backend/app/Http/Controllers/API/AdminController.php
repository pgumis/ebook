<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Uzytkownik;
use App\Models\Recenzja;
class AdminController extends Controller
{
    public function wszyscyUzytkownicy()
    {
        return response()->json(Uzytkownik::all());
    }

    public function wszystkieRecenzje()
    {
        return response()->json(
            Recenzja::with('ebook', 'uzytkownik')->get()
        );
    }
}
