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
        Schema::create('uzytkownicy', function (Blueprint $table) {
            $table->id();
            $table->string('imie');
            $table->string('nazwisko');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('haslo');
            $table->string('rola');
            $table->string('status')->default('aktywny');
            $table->string('numer_telefonu')->nullable()->unique();
            $table->string('avatar')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uzytkownicy');
    }
};
