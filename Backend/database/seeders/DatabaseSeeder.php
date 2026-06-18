<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@greenvin.com',
            'password' => bcrypt('admin123'),
            'is_admin' => true,
        ]);

        User::factory()->create([
            'name' => 'Staff',
            'email' => 'staff@greenvin.com',
            'password' => bcrypt('staff123'),
            'is_admin' => false,
        ]);

        $this->call([
            MenuSeeder::class,
        ]);
    }
}
