<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class CreateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create {--role=client : The role for the user (admin or client)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new user with specified role';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $role = $this->option('role');

        if (! in_array($role, ['admin', 'client'])) {
            $this->error('Role must be either "admin" or "client"');

            return 1;
        }

        $name = $this->ask('What is the user\'s name?');
        $email = $this->ask('What is the user\'s email?');

        // Check if user already exists
        if (User::where('email', $email)->exists()) {
            $this->error('A user with this email already exists!');

            return 1;
        }

        $password = $this->secret('What is the user\'s password?');
        $confirmPassword = $this->secret('Confirm the password');

        if ($password !== $confirmPassword) {
            $this->error('Passwords do not match!');

            return 1;
        }

        // Create the user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ]);

        // Assign role
        $user->assignRole($role);

        $this->info('User created successfully!');
        $this->table(
            ['Field', 'Value'],
            [
                ['Name', $user->name],
                ['Email', $user->email],
                ['Role', $role],
                ['ID', $user->id],
            ]
        );

        return 0;
    }
}
