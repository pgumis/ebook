<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Ebook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function dodajOkladke(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'ebook_id' => 'required|exists:ebooki,id',
        ]);

        $path = $request->file('file')->store('okladki', 's3');
        $url = Storage::disk('s3')->url($path);


        $ebook = Ebook::find($request->ebook_id);
        $ebook->okladka = $url;
        $ebook->save();

        return response()->json([
            'message' => 'Okładka przesłana i przypisana do e-booka!',
            'url' => $url,
        ]);
    }

        public function dodajEbooka(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,epub,mobi|max:51200',
        ]);

        $path = $request->file('file')->store('ebooki', 's3');
        $url = Storage::disk('s3')->url($path);

        return response()->json([
            'wiadomosc' => 'Plik e-booka przesłany!',
            'sciezka' => $path,
            'url' => $url,
        ]);
    }



}
