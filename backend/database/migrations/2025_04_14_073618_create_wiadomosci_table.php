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
        Schema::create('wiadomosci', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('uzytkownik_id')->nullable();
            $table->string('imie')->nullable();
            $table->string('email')->nullable();
            $table->string('temat');
            $table->text('tresc');
            $table->boolean('przeczytana')->default(false);
            $table->timestamps();

            $table->foreign('uzytkownik_id')->references('id')->on('uzytkownicy')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wiadomosci');
    }
};
