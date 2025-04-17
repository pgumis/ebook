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
        Schema::create('ebook_zamowienie', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('zamowienie_id');
            $table->unsignedBigInteger('ebook_id');
            $table->integer('ilosc')->default(1);
            $table->decimal('cena_jednostkowa', 8, 2);
            $table->timestamps();

            $table->foreign('zamowienie_id')->references('id')->on('zamowienia')->onDelete('cascade');
            $table->foreign('ebook_id')->references('id')->on('ebooki')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ebook_zamowienie');
    }
};
