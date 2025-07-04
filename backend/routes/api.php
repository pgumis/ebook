<?php

use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\EbookController;
use App\Http\Controllers\API\KoszykController;
use App\Http\Controllers\API\OwnerDashboardController;
use App\Http\Controllers\API\ProfilController;
use App\Http\Controllers\API\RecenzjaController;
use App\Http\Controllers\API\UploadController;
use App\Http\Controllers\API\WiadomoscController;
use App\Http\Controllers\API\ZamowienieController;
use App\Http\Controllers\API\DashboardController;
use App\Mail\TestMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')
    ->get('/user', function (Request $request) { return $request->user();});

Route::post('/rejestracja', [AuthController::class, 'rejestracja']);

Route::post('/logowanie', [AuthController::class, 'logowanie']);

Route::post('/zapomniane-haslo', [AuthController::class, 'zapomnianeHaslo']);


Route::post('/haslo/wyslij-kod', [AuthController::class, 'wyslijKodResetujacy']);

Route::post('/haslo/weryfikuj-kod', [AuthController::class, 'weryfikujKodResetujacy']);

Route::post('/haslo/resetuj', [AuthController::class, 'resetHasla']);


Route::middleware('auth:sanctum')
    ->put('/profil', [AuthController::class, 'aktualizujProfil']);

Route::middleware('auth:sanctum')
    ->put('/profil/zmien-haslo', [AuthController::class, 'zmienHaslo']);



Route::get('/ebooki', [EbookController::class, 'lista']);

Route::middleware(['auth:sanctum', 'sprawdz.role:admin,dostawca'])
    ->post('/ebooki', [EbookController::class, 'dodaj']);

Route::get('/ebooki/{id}', [EbookController::class, 'szczegoly']);

Route::middleware(['auth:sanctum', 'sprawdz.role:admin,dostawca'])
    ->put('/ebooki/{id}', [EbookController::class, 'edytuj']);

Route::middleware(['auth:sanctum', 'sprawdz.role:admin,dostawca'])
    ->get('/ebooki/dostawca/{id}', [EbookController::class, 'listaDostawcy']);

Route::middleware(['auth:sanctum', 'sprawdz.role:admin,dostawca'])
    ->get('/dostawca/dashboard-stats', [DashboardController::class, 'statystykaDostawcy']);

Route::middleware(['auth:sanctum', 'sprawdz.role:admin'])
    ->delete('/ebooki/{id}', [EbookController::class, 'usun']);

Route::middleware(['auth:sanctum', 'sprawdz.role:admin,dostawca'])
    ->put('/ebooki/{id}/wycofaj', [EbookController::class, 'wycofaj']);

Route::get('/ebooki/{id}/recenzje', [RecenzjaController::class, 'lista']);



Route::get('/zamowienia', [ZamowienieController::class, 'lista']);

Route::post('/zamowienia/dodaj', [ZamowienieController::class, 'dodaj']);


Route::put('/zamowienia/{id}', [ZamowienieController::class, 'edytuj']);

Route::delete('/zamowienia/{id}', [ZamowienieController::class, 'usun']);

Route::middleware(['auth:sanctum', 'sprawdz.role:klient,admin'])
    ->get('/zamowienia', [ZamowienieController::class, 'historia']);


Route::middleware(['auth:sanctum', 'sprawdz.role:klient'])
    ->get('/koszyk', [KoszykController::class, 'widok']);

Route::middleware(['auth:sanctum', 'sprawdz.role:klient'])
    ->post('/koszyk', [KoszykController::class, 'dodaj']);

Route::middleware(['auth:sanctum', 'sprawdz.role:klient'])
    ->delete('/koszyk/{id}', [KoszykController::class, 'usun']);

Route::post('/wiadomosci/wyslij', [WiadomoscController::class, 'wyslij']);

Route::get('/wiadomosci', [WiadomoscController::class, 'lista']);

Route::delete('/wiadomosci/{id}', [WiadomoscController::class, 'usun']);


Route::post('/dodajOkladke', [UploadController::class, 'dodajOkladke']);


Route::post('/dodajEbooka', [UploadController::class, 'dodajEbooka']);

Route::get('/strona-glowna', [EbookController::class, 'stronaGlowna']);
Route::get('/promocje', [EbookController::class, 'promocje']);
Route::get('/nowosci', [EbookController::class, 'nowosci']);
Route::get('/bestsellery', [EbookController::class, 'bestsellery']);
Route::get('/kategorie', [EbookController::class, 'kategorie']);
Route::get('/ebooki-kategoria', [EbookController::class, 'ebookiKategorii']);

Route::middleware(['auth:sanctum', 'sprawdz.role:dostawca'])
    ->get('/moje-ebooki', [EbookController::class, 'moje']);

Route::middleware('auth:sanctum')
    ->get('/recenzje/sprawdz/{ebook_id}', [RecenzjaController::class, 'sprawdzMozliwoscRecenzji']);

Route::middleware('auth:sanctum')
    ->post('/recenzje', [RecenzjaController::class, 'dodaj']);

Route::middleware('auth:sanctum')
    ->put('/recenzje/{id}', [RecenzjaController::class, 'edytuj']);

Route::middleware('auth:sanctum')
    ->delete('/recenzje/{id}', [RecenzjaController::class, 'usun']);

Route::middleware(['auth:sanctum', 'sprawdz.role:admin'])->prefix('admin')->group(function () {
    Route::get('/uzytkownicy', [AdminController::class, 'wszyscyUzytkownicy']);
    Route::get('/uzytkownicy/{id}', [AdminController::class, 'szczegolyUzytkownika']);
    Route::put('/uzytkownicy/{id}', [AdminController::class, 'aktualizujUzytkownika']);
    Route::put('/uzytkownicy/{id}/zmien-role', [AdminController::class, 'zmienRolaUzytkownika']);
    Route::get('/ebooki', [AdminController::class, 'wszystkieEbooki']);
    Route::put('/ebooki/{id}/status', [AdminController::class, 'zmienStatusEbooka']);
    Route::get('/recenzje', [AdminController::class, 'wszystkieRecenzje']);
    Route::delete('/recenzje/{id}', [AdminController::class, 'usunRecenzje']);
    Route::get('/zamowienia', [AdminController::class, 'wszystkieZamowienia']);
    Route::put('/zamowienia/{id}/status', [AdminController::class, 'zmienStatusZamowienia']);
    Route::get('/wiadomosci', [AdminController::class, 'wszystkieWiadomosci']);
    Route::put('/wiadomosci/{id}/przeczytaj', [AdminController::class, 'oznaczJakoPrzeczytana']);
    Route::delete('/wiadomosci/{id}', [AdminController::class, 'usunWiadomosc']);

});

Route::middleware(['auth:sanctum', 'sprawdz.role:wlasciciel'])->prefix('wlasciciel')->group(function () {

    Route::get('/main-dashboard', [OwnerDashboardController::class, 'getMainDashboardStats']);
    Route::get('/sales-analysis', [OwnerDashboardController::class, 'getSalesAnalysis']);
    Route::get('/users-analysis', [OwnerDashboardController::class, 'getUsersAnalysis']);
    Route::get('/products-analysis', [OwnerDashboardController::class, 'getProductsAnalysis']);
    Route::post('/generate-report', [OwnerDashboardController::class, 'generateReport']);
});

Route::middleware('auth:sanctum')
    ->post('/zamowienia/finalizuj', [ZamowienieController::class, 'finalizujZamowienie']);

Route::middleware('auth:sanctum')
    ->get('/profil/moja-polka', [ProfilController::class, 'pobraneEbooki']);

Route::middleware('auth:sanctum')
    ->get('/ebooks/{ebook}/pobierz', [EbookController::class, 'pobierzEbook']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/historia-zamowien', [ZamowienieController::class, 'historiaZamowien']);
    Route::get('/zamowienia/{zamowienie}', [ZamowienieController::class, 'szczegolyZamowienia']);
    Route::get('/dostawca/recenzje', [EbookController::class, 'recenzjeDostawcy']);
});

Route::get('/wyszukiwanie', [EbookController::class, 'wyszukaj']);
