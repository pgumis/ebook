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
        Schema::create('platnosci', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('zamowienie_id');
            $table->string('metoda');
            $table->decimal('kwota', 8, 2);
            $table->string('status')->default('oczekuje');
            $table->timestamp('data_platnosci')->nullable();
            $table->timestamps();

            $table->foreign('zamowienie_id')->references('id')->on('zamowienia')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('platnosci');
    }
};
