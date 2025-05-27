<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Movie\MovieController;
use App\Http\Controllers\SearchController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('browse', [MovieController::class, 'index'])->name('browse');
    Route::get('search', [SearchController::class, 'index'])->name('search');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
