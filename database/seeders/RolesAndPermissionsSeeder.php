<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'manage subscriptions',
            'view dashboard',
            'process payments',
            'manage users'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        $client = Role::firstOrCreate(['name' => 'client']);
        $client->givePermissionTo(['view dashboard']);

        $plans = [
            ['name' => 'Monthly', 'price' => 2999, 'interval' => 'month'],
            ['name' => 'Yearly', 'price' => 29999, 'interval' => 'year'],
        ];

        foreach ($plans as $plan) {
            \App\Models\Plan::firstOrCreate(['name' => $plan['name']], $plan);
        }
    }
}