<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 100)->unique();
            $table->text('value')->nullable();
            $table->string('group', 50)->default('general');
            $table->timestamps();
        });

        // Insert default settings
        DB::table('settings')->insert([
            ['key' => 'tax_rate', 'value' => '0.08', 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'store_name', 'value' => 'Greenvin Coffee', 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'store_address', 'value' => 'Phnom Penh, Cambodia', 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'store_phone', 'value' => '', 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'store_email', 'value' => 'hello@greenvin.com', 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'currency', 'value' => 'USD', 'group' => 'general', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
