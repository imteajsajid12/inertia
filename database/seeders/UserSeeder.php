<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create additional roles if they don't exist
        $roles = ['admin', 'manager', 'editor', 'user', 'client'];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Sample users data
        $users = [
            [
                'name' => 'John Administrator',
                'email' => 'john@admin.com',
                'phone' => '+1-555-0101',
                'address' => '123 Admin Street, New York, NY 10001',
                'status' => 'active',
                'role' => 'admin',
                'password' => 'password',
            ],
            [
                'name' => 'Sarah Manager',
                'email' => 'sarah@manager.com',
                'phone' => '+1-555-0102',
                'address' => '456 Manager Ave, Los Angeles, CA 90210',
                'status' => 'active',
                'role' => 'manager',
                'password' => 'password',
            ],
            [
                'name' => 'Mike Editor',
                'email' => 'mike@editor.com',
                'phone' => '+1-555-0103',
                'address' => '789 Editor Blvd, Chicago, IL 60601',
                'status' => 'active',
                'role' => 'editor',
                'password' => 'password',
            ],
            [
                'name' => 'Emily User',
                'email' => 'emily@user.com',
                'phone' => '+1-555-0104',
                'address' => '321 User Lane, Houston, TX 77001',
                'status' => 'active',
                'role' => 'user',
                'password' => 'password',
            ],
            [
                'name' => 'David Client',
                'email' => 'david@client.com',
                'phone' => '+1-555-0105',
                'address' => '654 Client Road, Phoenix, AZ 85001',
                'status' => 'active',
                'role' => 'client',
                'password' => 'password',
            ],
            [
                'name' => 'Lisa Inactive',
                'email' => 'lisa@inactive.com',
                'phone' => '+1-555-0106',
                'address' => '987 Inactive St, Philadelphia, PA 19101',
                'status' => 'inactive',
                'role' => 'user',
                'password' => 'password',
            ],
            [
                'name' => 'Tom Pending',
                'email' => 'tom@pending.com',
                'phone' => '+1-555-0107',
                'address' => '147 Pending Ave, San Antonio, TX 78201',
                'status' => 'pending',
                'role' => 'user',
                'password' => 'password',
            ],
            [
                'name' => 'Anna Suspended',
                'email' => 'anna@suspended.com',
                'phone' => '+1-555-0108',
                'address' => '258 Suspended Blvd, San Diego, CA 92101',
                'status' => 'suspended',
                'role' => 'user',
                'password' => 'password',
            ],
            [
                'name' => 'Robert Premium',
                'email' => 'robert@premium.com',
                'phone' => '+1-555-0109',
                'address' => '369 Premium Dr, Dallas, TX 75201',
                'status' => 'active',
                'role' => 'client',
                'password' => 'password',
            ],
            [
                'name' => 'Jennifer Test',
                'email' => 'jennifer@test.com',
                'phone' => '+1-555-0110',
                'address' => '741 Test Circle, San Jose, CA 95101',
                'status' => 'active',
                'role' => 'user',
                'password' => 'password',
            ],
        ];

        foreach ($users as $userData) {
            // Check if user already exists
            $existingUser = User::where('email', $userData['email'])->first();

            if (! $existingUser) {
                $user = User::create([
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'phone' => $userData['phone'],
                    'address' => $userData['address'],
                    'status' => $userData['status'],
                    'password' => Hash::make($userData['password']),
                    'email_verified_at' => now(),
                    'last_login_at' => rand(0, 1) ? now()->subDays(rand(1, 30)) : null,
                ]);

                // Assign role
                $user->assignRole($userData['role']);

                $this->command->info("Created user: {$userData['name']} ({$userData['email']})");
            } else {
                $this->command->info("User already exists: {$userData['email']}");
            }
        }

        $this->command->info('User seeding completed!');
        $this->command->info('All users have password: password');
    }
}
