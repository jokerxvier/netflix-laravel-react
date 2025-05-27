<?php

namespace App\Http\Controllers;

use App\Models\UserMovieList;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserMovieListController extends Controller
{
    /**
     * Add a movie to the user's list.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'movie_id' => 'required|integer',
            'movie_title' => 'required|string',
            'movie_poster_path' => 'nullable|string',
            'movie_backdrop_path' => 'nullable|string',
            'movie_overview' => 'nullable|string',
            'movie_release_date' => 'nullable|string',
            'media_type' => 'nullable|string|in:movie,tv',
        ]);

        $user = Auth::user();

        // Check if movie is already in the user's list
        $existingItem = UserMovieList::where('user_id', $user->id)
            ->where('movie_id', $request->movie_id)
            ->first();

        if ($existingItem) {
            return response()->json([
                'message' => 'Movie is already in your list',
                'in_list' => true
            ], 409);
        }

        // Add movie to user's list
        $movieListItem = UserMovieList::create([
            'user_id' => $user->id,
            'movie_id' => $request->movie_id,
            'movie_title' => $request->movie_title,
            'movie_poster_path' => $request->movie_poster_path,
            'movie_backdrop_path' => $request->movie_backdrop_path,
            'movie_overview' => $request->movie_overview,
            'movie_release_date' => $request->movie_release_date,
            'media_type' => $request->media_type ?? 'movie',
        ]);

        return response()->json([
            'message' => 'Movie added to your list',
            'in_list' => true,
            'item' => $movieListItem
        ], 201);
    }

    /**
     * Remove a movie from the user's list.
     */
    public function destroy(Request $request, int $movieId): JsonResponse
    {
        $user = Auth::user();

        $movieListItem = UserMovieList::where('user_id', $user->id)
            ->where('movie_id', $movieId)
            ->first();

        if (!$movieListItem) {
            return response()->json([
                'message' => 'Movie not found in your list',
                'in_list' => false
            ], 404);
        }

        $movieListItem->delete();

        return response()->json([
            'message' => 'Movie removed from your list',
            'in_list' => false
        ], 200);
    }

    /**
     * Check if a movie is in the user's list.
     */
    public function check(Request $request, int $movieId): JsonResponse
    {
        $user = Auth::user();

        $inList = UserMovieList::where('user_id', $user->id)
            ->where('movie_id', $movieId)
            ->exists();

        return response()->json([
            'in_list' => $inList
        ]);
    }

    /**
     * Get the user's movie list page.
     */
    public function index(): Response
    {
        $user = Auth::user();

        $movieList = UserMovieList::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('my-list/index', [
            'movies' => $movieList
        ]);
    }

    /**
     * Get the user's movie list as JSON.
     */
    public function api(): JsonResponse
    {
        $user = Auth::user();

        $movieList = UserMovieList::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'movies' => $movieList
        ]);
    }
} 