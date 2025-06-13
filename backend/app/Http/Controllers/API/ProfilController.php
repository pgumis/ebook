<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfilController extends Controller
{
    public function pobraneEbooki(Request $request)
    {
        $uzytkownikId = $request->user()->id;


        $ebooki = \App\Models\Ebook::whereHas('zamowienia', function ($query) use ($uzytkownikId) {
            $query->where('uzytkownik_id', $uzytkownikId)
                ->where('status', 'zrealizowane');
        })->get();

        return response()->json($ebooki);
    }
}
