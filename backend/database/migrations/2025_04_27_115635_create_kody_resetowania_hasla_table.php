<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up() : void
    {
        Schema::create('kody_resetowania_hasla', function (Blueprint $table) {
            $table->id();
            $table->string('email')->index();
            $table->string('kod');
            $table->timestamp('waznosc');
            $table->timestamps();
        });
    }

    public function down() : void
    {
        Schema::dropIfExists('kody_resetowania_hasla');
    }
};
