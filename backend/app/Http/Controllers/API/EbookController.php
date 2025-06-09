<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ebook;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EbookController extends Controller
{
    //

    public function lista()
    {
        $ebooki = Ebook::where('status', 'aktywny')->get();


        return response()->json($ebooki, 200);
    }

    public function dodaj(Request $request)
    {
        $dane = $request->all();

        $validator = Validator::make($dane, [
            'tytul' => 'required|string|max:255',
            'autor' => 'required|string|max:255',
            'opis' => 'nullable|string',
            'isbn' => 'nullable|string|max:20',
            'liczba_stron' => 'nullable|integer|min:1',
            'wydawnictwo' => 'nullable|string|max:255',
            'kategoria' => 'nullable|string|max:255',
            'jezyk' => 'nullable|string|max:20',
            'data_wydania' => 'nullable|date',
            'cena' => 'required|numeric|min:0',
            'cena_promocyjna' => 'nullable|numeric|min:0|lt:cena',
            'format' => 'required|string|in:PDF,EPUB,MOBI',
            'plik' => 'nullable|string',
            'okladka' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $ebook = new Ebook($validator->validated());

        $ebook->uzytkownik_id = $request->user()->id;

        $ebook->save();

        return response()->json([
            'komunikat' => 'E-book został dodany',
            'ebook' => $ebook
        ], 201);
    }

    public function szczegoly($id)
    {
        $ebook = Ebook::where('id', $id)
            ->where('status', 'aktywny')
            ->first();

        if (!$ebook) {
            return response()->json(['komunikat' => 'E-book nie istnieje lub został wycofany.'], 404);
        }

        return response()->json($ebook);
    }

    public function edytuj(Request $request, $id)
    {
        $ebook = Ebook::find($id);

        if (!$ebook) {
            return response()->json(['komunikat' => 'E-book nie istnieje'], 404);
        }

        if ($request->user()->rola === 'dostawca' && $ebook->uzytkownik_id !== $request->user()->id) {
            return response()->json(['komunikat' => 'Brak uprawnień do edycji tego e-booka.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'tytul' => 'sometimes|required|string|max:255',
            'autor' => 'sometimes|required|string|max:255',
            'opis' => 'nullable|string',
            'isbn' => 'nullable|string|max:20',
            'liczba_stron' => 'nullable|integer|min:1',
            'wydawnictwo' => 'nullable|string|max:255',
            'kategoria' => 'nullable|string|max:255',
            'jezyk' => 'nullable|string|max:20',
            'data_wydania' => 'nullable|date',
            'cena' => 'sometimes|required|numeric|min:0',
            'cena_promocyjna' => 'nullable|numeric|min:0|lt:cena',
            'format' => 'sometimes|required|string|in:PDF,EPUB,MOBI',
            'plik' => 'nullable|string',
            'okladka' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $ebook->update($validator->validated());

        return response()->json([
            'komunikat' => 'E-book został zaktualizowany',
            'ebook' => $ebook
        ], 200);
    }

    public function usun($id, Request $request)
    {
        $ebook = Ebook::find($id);

        if (!$ebook) {
            return response()->json(['komunikat' => 'E-book nie istnieje'], 404);
        }

        if ($request->user()->rola === 'dostawca' && $ebook->uzytkownik_id !== $request->user()->id) {
            return response()->json(['komunikat' => 'Brak uprawnień do usunięcia tego e-booka.'], 403);
        }

        $ebook->delete();

        return response()->json(['komunikat' => 'E-book został usunięty'], 200);
    }

    public function wycofaj($id, Request $request)
    {
        $ebook = Ebook::find($id);

        if (!$ebook) {
            return response()->json(['komunikat' => 'E-book nie istnieje.'], 404);
        }

        if ($request->user()->rola === 'dostawca' && $ebook->uzytkownik_id !== $request->user()->id) {
            return response()->json(['komunikat' => 'Brak uprawnień do wycofania tego e-booka.'], 403);
        }

        $ebook->status = 'wycofany';
        $ebook->save();

        return response()->json(['komunikat' => 'E-book został wycofany.']);
    }


    public function stronaGlowna(Request $request)
    {
        $okres = $request->query('okres', 'rok');

        switch ($okres) {
            case 'tydzien':
                $dataPoczatkowa = Carbon::now()->subWeek();
                break;
            case 'miesiac':
                $dataPoczatkowa = Carbon::now()->subMonth();
                break;
            case 'rok':
            default:
                $dataPoczatkowa = Carbon::now()->subYear();
                break;
        }

        $nowosci = Ebook::where('status', 'aktywny')->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        $bestsellery = Ebook::select(
            'ebooki.id',
            'ebooki.tytul',
            'ebooki.autor',
            'ebooki.cena',
            'ebooki.cena_promocyjna',
            'ebooki.format',
            DB::raw('COUNT(ebook_zamowienie.ebook_id) as liczba_sprzedazy')
        )
            ->join('ebook_zamowienie', 'ebooki.id', '=', 'ebook_zamowienie.ebook_id')
            ->where('ebook_zamowienie.created_at', '>=', $dataPoczatkowa)
            ->groupBy(
                'ebooki.id',
                'ebooki.tytul',
                'ebooki.autor',
                'ebooki.cena',
                'ebooki.cena_promocyjna',
                'ebooki.format'
            )
            ->orderByDesc('liczba_sprzedazy')
            ->take(6)
            ->get();

        $promocje = Ebook::whereNotNull('cena_promocyjna')
            ->whereColumn('cena_promocyjna', '<', 'cena')
            ->take(6)
            ->get();

        return response()->json([
            'nowosci' => $nowosci,
            'bestsellery' => $bestsellery,
            'promocje' => $promocje,
        ]);
    }

    public function kategorie()
    {
        $kategorie = Ebook::select('kategoria')
            ->distinct()
            ->orderBy('kategoria') // Sortowanie alfabetyczne jest pomocne dla wyświetlania
            ->get()
            ->pluck('kategoria'); // Pobierz tylko wartości z kolumny 'kategoria' jako prostą tablicę

        return response()->json($kategorie);
    }


    public function promocje()
    {
        $promocje = Ebook::where('status', 'aktywny')
            ->whereNotNull('cena_promocyjna')
            ->whereColumn('cena_promocyjna', '<', 'cena')
            ->orderBy('created_at', 'desc')
            ->paginate(12); // 12 książek na stronę

        return response()->json($promocje);
    }

    public function nowosci()
    {
        $nowosci = Ebook::where('status', 'aktywny')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json($nowosci);
    }


    public function bestsellery(Request $request)
    {
        $okres = $request->query('okres', 'rok');

        switch ($okres) {
            case 'tydzien':
                $dataPoczatkowa = Carbon::now()->subWeek();
                break;
            case 'miesiac':
                $dataPoczatkowa = Carbon::now()->subMonth();
                break;
            case 'rok':
            default:
                $dataPoczatkowa = Carbon::now()->subYear();
                break;
        }

        $bestsellery = Ebook::select(
            'ebooki.id',
            'ebooki.tytul',
            'ebooki.autor',
            'ebooki.cena',
            'ebooki.cena_promocyjna',
            'ebooki.format',
            DB::raw('COUNT(ebook_zamowienie.ebook_id) as liczba_sprzedazy')
        )
            ->join('ebook_zamowienie', 'ebooki.id', '=', 'ebook_zamowienie.ebook_id')
            ->where('ebook_zamowienie.created_at', '>=', $dataPoczatkowa)
            ->where('status', 'aktywny')
            ->groupBy(
                'ebooki.id',
                'ebooki.tytul',
                'ebooki.autor',
                'ebooki.cena',
                'ebooki.cena_promocyjna',
                'ebooki.format'
            )
            ->orderByDesc('liczba_sprzedazy')
            ->paginate(12);

        return response()->json($bestsellery);
    }

    public function moje(Request $request)
    {
        $query = Ebook::where('uzytkownik_id', $request->user()->id)
            ->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }




}
