<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ebooki', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('uzytkownik_id')->nullable();
            $table->foreign('uzytkownik_id')->references('id')->on('uzytkownicy')->onDelete('set null');
            $table->string('tytul');
            $table->string('autor');
            $table->text('opis')->nullable();
            $table->string('isbn')->nullable();
            $table->integer('liczba_stron')->nullable();
            $table->string('wydawnictwo')->nullable();
            $table->string('kategoria')->nullable();
            $table->string('jezyk')->nullable();
            $table->date('data_wydania')->nullable();
            $table->decimal('cena', 8, 2);
            $table->decimal('cena_promocyjna', 8, 2)->nullable();
            $table->string('format');
            $table->string('plik')->nullable();
            $table->string('okladka')->nullable();
            $table->string('status')->default('aktywny');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ebooki');
    }
};
