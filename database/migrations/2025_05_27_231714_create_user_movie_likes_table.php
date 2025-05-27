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
        Schema::create('user_movie_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('movie_id'); // TMDB movie ID
            $table->string('movie_title');
            $table->string('movie_poster_path')->nullable();
            $table->string('movie_backdrop_path')->nullable();
            $table->text('movie_overview')->nullable();
            $table->string('movie_release_date')->nullable();
            $table->string('media_type')->default('movie'); // 'movie' or 'tv'
            $table->timestamps();
            
            // Ensure a user can't like the same movie twice
            $table->unique(['user_id', 'movie_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_movie_likes');
    }
};
