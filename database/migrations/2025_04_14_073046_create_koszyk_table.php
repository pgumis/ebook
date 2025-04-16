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
        Schema::create('koszyk', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('uzytkownik_id');
            $table->unsignedBigInteger('ebook_id');
            $table->integer('ilosc')->default(1);
            $table->timestamps();

            $table->foreign('uzytkownik_id')->references('id')->on('uzytkownicy')->onDelete('cascade');
            $table->foreign('ebook_id')->references('id')->on('ebooki')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('koszyk');
    }
};
