<?php

use App\Http\Controllers\API\EbookController;
use App\Http\Controllers\API\KoszykController;
use App\Http\Controllers\API\UploadController;
use App\Http\Controllers\API\WiadomoscController;
use App\Http\Controllers\API\ZamowienieController;
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


Route::middleware(['auth:sanctum', 'sprawdz.role:admin'])
    ->delete('/ebooki/{id}', [EbookController::class, 'usun']);

Route::middleware(['auth:sanctum', 'sprawdz.role:admin,dostawca'])
    ->put('/ebooki/{id}/wycofaj', [EbookController::class, 'wycofaj']);


Route::get('/zamowienia', [ZamowienieController::class, 'lista']);

Route::post('/zamowienia/dodaj', [ZamowienieController::class, 'dodaj']);

Route::middleware(['auth:sanctum', 'sprawdz.role:klient,admin'])
    ->get('/zamowienia/{id}', [ZamowienieController::class, 'szczegoly']);

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

Route::post('/wiadomosci', [WiadomoscController::class, 'wyslij']);

Route::get('/wiadomosci', [WiadomoscController::class, 'lista']);

Route::delete('/wiadomosci/{id}', [WiadomoscController::class, 'usun']);


Route::post('/dodajOkladke', [UploadController::class, 'dodajOkladke']);


Route::post('/dodajEbooka', [UploadController::class, 'dodajEbooka']);

Route::get('/strona-glowna', [EbookController::class, 'stronaGlowna']);
Route::get('/promocje', [EbookController::class, 'promocje']);
Route::get('/nowosci', [EbookController::class, 'nowosci']);
Route::get('/bestsellery', [EbookController::class, 'bestsellery']);

Route::middleware(['auth:sanctum', 'sprawdz.role:dostawca'])
    ->get('/moje-ebooki', [EbookController::class, 'moje']);
