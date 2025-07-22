<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User management
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Plan management
            'view plans',
            'create plans',
            'edit plans',
            'delete plans',

            // Subscription management
            'view subscriptions',
            'manage subscriptions',

            // Analytics
            'view analytics',

            // System settings
            'manage settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $clientRole = Role::firstOrCreate(['name' => 'client']);

        // Admin gets all permissions
        $adminRole->syncPermissions(Permission::all());

        // Client gets limited permissions (none for now, they access through controllers)
        // Clients don't need explicit permissions as access is controlled by role middleware

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'status' => 'active',
            ]
        );

        $admin->assignRole('admin');

        // Create sample client user
        $client = User::firstOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Client User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'status' => 'active',
            ]
        );

        $client->assignRole('client');

        $this->command->info('Roles and permissions created successfully!');
        $this->command->info('Admin: admin@example.com / password');
        $this->command->info('Client: client@example.com / password');
    }
}
