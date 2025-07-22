<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            // Add trial_days column
            $table->integer('trial_days')->default(0)->after('billing_period');

            // Add sort_order column
            $table->integer('sort_order')->default(0)->after('is_active');

            // Combine gateway-specific plan IDs into a single JSON column
            $table->json('gateway_ids')->nullable()->after('features');
        });

        // Migrate existing data to new structure
        DB::table('plans')->get()->each(function ($plan) {
            $gatewayIds = [];
            if ($plan->stripe_plan_id) {
                $gatewayIds['stripe'] = $plan->stripe_plan_id;
            }
            if ($plan->paypal_plan_id) {
                $gatewayIds['paypal'] = $plan->paypal_plan_id;
            }
            if ($plan->bkash_plan_id) {
                $gatewayIds['bkash'] = $plan->bkash_plan_id;
            }
            if ($plan->sslcommerz_plan_id) {
                $gatewayIds['sslcommerz'] = $plan->sslcommerz_plan_id;
            }

            DB::table('plans')->where('id', $plan->id)->update([
                'gateway_ids' => json_encode($gatewayIds),
            ]);
        });

        Schema::table('plans', function (Blueprint $table) {
            // Drop individual gateway columns
            $table->dropColumn(['stripe_plan_id', 'paypal_plan_id', 'bkash_plan_id', 'sslcommerz_plan_id', 'gateway', 'currency']);
        });
    }

    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            // Restore individual gateway columns
            $table->string('stripe_plan_id')->nullable();
            $table->string('paypal_plan_id')->nullable();
            $table->string('bkash_plan_id')->nullable();
            $table->string('sslcommerz_plan_id')->nullable();
            $table->string('gateway')->default('stripe');
            $table->string('currency')->default('USD');
        });

        // Migrate data back
        DB::table('plans')->get()->each(function ($plan) {
            $gatewayIds = json_decode($plan->gateway_ids, true) ?? [];

            DB::table('plans')->where('id', $plan->id)->update([
                'stripe_plan_id' => $gatewayIds['stripe'] ?? null,
                'paypal_plan_id' => $gatewayIds['paypal'] ?? null,
                'bkash_plan_id' => $gatewayIds['bkash'] ?? null,
                'sslcommerz_plan_id' => $gatewayIds['sslcommerz'] ?? null,
            ]);
        });

        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn(['trial_days', 'sort_order', 'gateway_ids']);
        });
    }
};
