<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ebook;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
            'plik' => 'required|file|mimes:pdf,epub,mobi|max:51200',
            'okladka' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        $ebook = new Ebook($validator->validated());

        $ebook->uzytkownik_id = $request->user()->id;
        $ebook->tytul = $request->tytul;
        $ebook->opis = $request->opis;
        $ebook->cena = $request->cena;
        $ebook->cena_promocyjna = $request->cena_promocyjna;
        $ebook->jezyk = $request->jezyk;
        $ebook->kategoria = $request->kategoria;

        // Upload pliku e-booka na S3
        if ($request->hasFile('plik')) {
            $plik = $request->file('plik');
            $plikPath = $plik->store('ebooki', 's3');
            $ebook->plik = Storage::disk('s3')->url($plikPath);

            // Ustaw format na podstawie rozszerzenia (np. "pdf" → "PDF")
            $ebook->format = strtoupper($plik->getClientOriginalExtension());
        }

        // Upload okładki na S3 (opcjonalnie)
        if ($request->hasFile('okladka')) {
            $okladkaPath = $request->file('okladka')->store('okladki', 's3');
            $ebook->okladka = Storage::disk('s3')->url($okladkaPath);
        }


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
        $kategoria = $request->query('kategoria'); // <--- Dodana linia do pobierania kategorii

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

        // Funkcja pomocnicza do dodawania filtru kategorii do zapytań
        $applyCategoryFilter = function ($query) use ($kategoria) {
            if ($kategoria) {
                $query->where('kategoria', $kategoria);
            }
            return $query;
        };

        $nowosci = Ebook::where('status', 'aktywny');
        $nowosci = $applyCategoryFilter($nowosci)
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        $bestsellery = Ebook::select(
            'ebooki.id',
            'ebooki.tytul',
            'ebooki.autor',
            'ebooki.cena',
            'ebooki.cena_promocyjna',
            'ebooki.format',
            'ebooki.okladka', // DODAŁEM OKLADKE, bo jest potrzebna w Book.jsx
            DB::raw('COUNT(ebook_zamowienie.ebook_id) as liczba_sprzedazy')
        )
            ->join('ebook_zamowienie', 'ebooki.id', '=', 'ebook_zamowienie.ebook_id')
            ->where('ebook_zamowienie.created_at', '>=', $dataPoczatkowa)
            ->where('ebooki.status', 'aktywny');

        $bestsellery = $applyCategoryFilter($bestsellery)
            ->groupBy(
                'ebooki.id',
                'ebooki.tytul',
                'ebooki.autor',
                'ebooki.cena',
                'ebooki.cena_promocyjna',
                'ebooki.format',
                'ebooki.okladka' // GRUPUJ TEŻ PO OKŁADCE
            )
            ->orderByDesc('liczba_sprzedazy')
            ->take(6)
            ->get();


        $promocje = Ebook::whereNotNull('cena_promocyjna')
            ->whereColumn('cena_promocyjna', '<', 'cena')
            ->where('status', 'aktywny');

        $promocje = $applyCategoryFilter($promocje)
            ->take(6)
            ->get();

        return response()->json([
            'nowosci' => $nowosci,
            'bestsellery' => $bestsellery,
            'promocje' => $promocje,
        ]);
    }

    public function ebookiKategorii(Request $request)
    {
        $kategoria = $request->query('kategoria'); // Pobierz kategorię z parametru zapytania URL
        $query = Ebook::where('status', 'aktywny');

        if ($kategoria) {
            $query->where('kategoria', $kategoria);
        }

        $query->orderBy('tytul', 'asc'); // Domyślne sortowanie

        $ebooki = $query->paginate(12); // Paginacja, np. 12 książek na stronę

        return response()->json($ebooki);
    }

    public function kategorie()
    {
        // Pobierz listę wszystkich kategorii z pliku konfiguracyjnego
        $wszystkieKategorie = Config::get('kategorie.lista');


        // Zwróć wszystkie kategorie z pliku konfiguracyjnego
        return response()->json($wszystkieKategorie);
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

    public function listaDostawcy(Request $request, $providerId)
    {
        // Sprawdź, czy zalogowany użytkownik jest tym samym dostawcą, którego książki chce pobrać

        if ($request->user()->id != $providerId && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Brak autoryzacji do przeglądania tych książek.'], 403);
        }


        $ebooks = Ebook::where('uzytkownik_id', $providerId)
        ->get();


        return response()->json($ebooks);
    }


}
