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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('billing_period')->default('monthly'); // monthly, yearly, etc.
            $table->string('currency')->default('USD');
            $table->string('stripe_plan_id')->nullable();
            $table->string('paypal_plan_id')->nullable();
            $table->string('bkash_plan_id')->nullable();
            $table->string('sslcommerz_plan_id')->nullable();
            $table->string('gateway')->default('stripe');
            $table->boolean('is_active')->default(true);
            $table->json('features')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};