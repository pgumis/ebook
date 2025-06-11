// database/migrations/YOUR_TIMESTAMP_add_zdjecie_profilowe_to_uzytkownicy_table.php
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
        Schema::table('uzytkownicy', function (Blueprint $table) {
            // Dodajemy nową kolumnę 'zdjecie_profilowe'
            // Typ string, może być nullable (czyli może być pusta), domyślnie pusty string
            $table->string('zdjecie_profilowe')->nullable()->default('')->after('rola'); // Po kolumnie 'rola' (lub innej, którą uznasz za sensowną)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('uzytkownicy', function (Blueprint $table) {
            // Usuwamy kolumnę 'zdjecie_profilowe' w przypadku wycofania migracji
            $table->dropColumn('zdjecie_profilowe');
        });
    }
};
