<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Movie\MovieController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserMovieListController;
use App\Http\Controllers\UserMovieLikeController;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/', [MovieController::class, 'index'])->name('browse');
    Route::get('search', [SearchController::class, 'index'])->name('search');
    
    // My List page
    Route::get('my-list', [UserMovieListController::class, 'index'])->name('my-list');
    
    // Liked Movies page
    Route::get('liked-movies', [UserMovieLikeController::class, 'page'])->name('liked-movies');
    
    // User Movie List API routes
    Route::prefix('my-list')->name('my-list.')->group(function () {
        Route::get('/api', [UserMovieListController::class, 'api'])->name('api');
        Route::post('/', [UserMovieListController::class, 'store'])->name('store');
        Route::delete('/{movieId}', [UserMovieListController::class, 'destroy'])->name('destroy');
        Route::get('/check/{movieId}', [UserMovieListController::class, 'check'])->name('check');
    });
    
    // User Movie Likes API routes
    Route::prefix('movie-likes')->name('movie-likes.')->group(function () {
        Route::get('/', [UserMovieLikeController::class, 'index'])->name('index');
        Route::post('/', [UserMovieLikeController::class, 'store'])->name('store');
        Route::delete('/{movieId}', [UserMovieLikeController::class, 'destroy'])->name('destroy');
        Route::get('/check/{movieId}', [UserMovieLikeController::class, 'check'])->name('check');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
