<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateTestUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:create-test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create test admin and client users for development';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Creating test users...');

        // Create admin user
        $admin = User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Test Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        // Create client user
        $client = User::updateOrCreate(
            ['email' => 'client@test.com'],
            [
                'name' => 'Test Client',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $client->assignRole('client');

        $this->info('Test users created successfully!');
        $this->table(
            ['Role', 'Name', 'Email', 'Password'],
            [
                ['Admin', 'Test Admin', 'admin@test.com', 'password'],
                ['Client', 'Test Client', 'client@test.com', 'password'],
            ]
        );

        return 0;
    }
}
