<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Recenzja;
use Illuminate\Http\Request;
use App\Models\Ebook;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

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
            'plik' => 'required|file|extensions:pdf,epub,mobi|max:51200',
            'okladka' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['bledy' => $validator->errors()], 422);
        }

        // Pobierz tylko zwalidowane dane
        $dane = $validator->validated();

        // Utwórz nowy, pusty model e-booka
        $ebook = new Ebook($dane);

        $ebook->uzytkownik_id = $request->user()->id;

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
        $ebook = Ebook::withAvg('recenzje', 'ocena')
            ->where('id', $id)
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

        $nowosci = Ebook::withAvg('recenzje', 'ocena')
        ->where('status', 'aktywny');
        $nowosci = $applyCategoryFilter($nowosci)
            ->orderBy('created_at', 'desc')
            ->take(12)
            ->get();

        $bestsellery = Ebook::select(
            'ebooki.id',
            'ebooki.tytul',
            'ebooki.autor',
            'ebooki.cena',
            'ebooki.cena_promocyjna',
            'ebooki.format',
            'ebooki.okladka', // DODAŁEM OKLADKE, bo jest potrzebna w Book.jsx
            DB::raw('COUNT(DISTINCT ebook_zamowienie.ebook_id) as liczba_sprzedazy'),
            DB::raw('AVG(recenzje.ocena) as recenzje_avg_ocena')

        )
            ->join('ebook_zamowienie', 'ebooki.id', '=', 'ebook_zamowienie.ebook_id')
            ->leftJoin('recenzje', 'ebooki.id', '=', 'recenzje.ebook_id')
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
                'ebooki.okladka'
            )
            ->orderByDesc('liczba_sprzedazy')
            ->take(12)
            ->get();


        $promocje = Ebook::withAvg('recenzje', 'ocena')
            ->whereNotNull('cena_promocyjna')
            ->whereColumn('cena_promocyjna', '<', 'cena')
            ->where('status', 'aktywny');

        $promocje = $applyCategoryFilter($promocje)
            ->take(12)
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
        $query = Ebook::withAvg('recenzje', 'ocena')->where('status', 'aktywny');


        if ($kategoria) {
            $query->where('kategoria', $kategoria);
        }

        $query->orderBy('tytul', 'asc'); // Domyślne sortowanie

        $ebooki = $query->paginate(15); // Paginacja, np. 12 książek na stronę

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
        $promocje = Ebook::withAvg('recenzje', 'ocena')
            ->where('status', 'aktywny')
            ->whereNotNull('cena_promocyjna')
            ->whereColumn('cena_promocyjna', '<', 'cena')
            ->orderBy('created_at', 'desc')
            ->paginate(12); // 12 książek na stronę

        return response()->json($promocje);
    }

    public function nowosci()
    {
        $nowosci = Ebook::withAvg('recenzje', 'ocena')
            ->where('status', 'aktywny')
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
            ->withAvg('recenzje', 'ocena')
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
        $query = Ebook::withAvg('recenzje', 'ocena')
            ->where('uzytkownik_id', $request->user()->id)
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


        $ebooks = Ebook::withAvg('recenzje', 'ocena')
        ->where('uzytkownik_id', $providerId)
        ->get();


        return response()->json($ebooks);
    }

    public function pobierzEbook(Request $request, Ebook $ebook)
    {
        // Krok 1: Sprawdź, czy użytkownik ma prawo pobrać ten plik (czy go zakupił)
        $uzytkownik = $request->user();
        $maDostep = $uzytkownik
            ->zamowienia()
            ->where('status', 'zrealizowane')
            ->whereHas('ebooki', function ($query) use ($ebook) {
                $query->where('ebook_id', $ebook->id);
            })->exists();

        // Admin i dostawca tego e-booka zawsze mają dostęp
        if (!$maDostep && $uzytkownik->rola !== 'admin' && $ebook->uzytkownik_id !== $uzytkownik->id) {
            return response()->json(['komunikat' => 'Brak uprawnień do pobrania tego pliku.'], 403);
        }

        // === POCZĄTEK ZMIANY: Tworzenie nazwy pliku z tytułu ===

        // 1. Stwórz "slug", czyli bezpieczną wersję tytułu (np. "Wielka Podróż" -> "wielka-podroz")
        $slug = Str::slug($ebook->tytul);

        // 2. Pobierz format pliku i zamień na małe litery (np. "PDF" -> "pdf")
        $format = strtolower($ebook->format);

        // 3. Połącz wszystko w finalną, bezpieczną nazwę pliku
        $nazwaDoPobrania = "{$slug}.{$format}";

        // === KONIEC ZMIANY ===

        // Krok 2: Wygeneruj Pre-signed URL z dodatkowymi opcjami
        // Wyciągamy samą ścieżkę z pełnego URL-a pliku na S3
        $sciezkaDoPliku = ltrim(parse_url($ebook->plik)['path'], '/');

        $url = Storage::disk('s3')->temporaryUrl(
            $sciezkaDoPliku,
            now()->addMinutes(5), // Link będzie ważny przez 5 minut
            [
                'ResponseContentDisposition' => 'attachment; filename="' . $nazwaDoPobrania . '"',
            ]
        );

        // Krok 3: Przekieruj użytkownika pod wygenerowany adres
        return response()->json(['download_url' => $url]);
    }

    public function recenzjeDostawcy(Request $request)
    {
        $dostawca = $request->user();

        $ebookIds = Ebook::where('uzytkownik_id', $dostawca->id)->pluck('id');

        $recenzje = Recenzja::select(['id', 'ocena', 'tresc', 'created_at', 'uzytkownik_id', 'ebook_id'])
            ->with([
                'uzytkownik:id,imie',
                'ebook:id,tytul'
            ])
            ->whereIn('ebook_id', $ebookIds)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($recenzje);
    }
    // app/Http/Controllers/API/EbookController.php

    public function wyszukaj(Request $request)
    {
        // Walidacja dla wszystkich możliwych parametrów
        $validated = $request->validate([
            'term'      => 'nullable|string|min:2',
            'kategoria' => 'nullable|string',
            'format'    => 'nullable|string|in:PDF,EPUB,MOBI',
            'cena_min'  => 'nullable|numeric|min:0',
            'cena_max'  => 'nullable|numeric|min:0',
            'sort_by'   => 'nullable|string|in:relevance,price_asc,price_desc,latest', // Dodajemy sortowanie
        ]);

        $term = $validated['term'] ?? null;

        $query = Ebook::select(['id', 'tytul', 'autor', 'okladka', 'cena', 'cena_promocyjna', 'format', 'created_at'])
            ->where('status', 'aktywny');

        if ($term) {
            $query->where(function ($q) use ($term) {
                $q->where('tytul', 'LIKE', "%{$term}%")
                    ->orWhere('autor', 'LIKE', "%{$term}%");
            });
        }

        // --- LOGIKA FILTROWANIA (z nowymi filtrami) ---
        if (!empty($validated['kategoria'])) {
            $query->where('kategoria', $validated['kategoria']);
        }
        if (!empty($validated['format'])) {
            $query->where('format', $validated['format']);
        }
        if (!empty($validated['cena_min'])) {
            $query->where('cena', '>=', $validated['cena_min']);
        }
        if (!empty($validated['cena_max'])) {
            $query->where('cena', '<=', $validated['cena_max']);
        }

        // --- NOWA LOGIKA SORTOWANIA ---
        $sortBy = $validated['sort_by'] ?? 'relevance';

        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('cena', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('cena', 'desc');
                break;
            case 'latest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                // Domyślne sortowanie (trafność) - można dodać bardziej skomplikowaną logikę
                // na razie pozostawiamy domyślne sortowanie bazy danych
                break;
        }

        $wyniki = $query->limit(20)->get(); // Zwracamy trochę więcej wyników, gdy są filtry

        return response()->json($wyniki);
    }

}
