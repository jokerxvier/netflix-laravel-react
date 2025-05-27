<?php

namespace App\Http\Controllers;

use App\Models\UserMovieLike;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserMovieLikeController extends Controller
{
    /**
     * Check if a movie is liked by the current user
     */
    public function check(int $movieId): JsonResponse
    {
        $isLiked = UserMovieLike::where('user_id', Auth::id())
            ->where('movie_id', $movieId)
            ->exists();

        return response()->json(['is_liked' => $isLiked]);
    }

    /**
     * Like a movie
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'movie_id' => 'required|integer',
                'movie_title' => 'required|string|max:255',
                'movie_poster_path' => 'nullable|string',
                'movie_backdrop_path' => 'nullable|string',
                'movie_overview' => 'nullable|string',
                'movie_release_date' => 'nullable|string',
                'media_type' => 'nullable|string|in:movie,tv',
            ]);

            $validated['user_id'] = Auth::id();
            $validated['media_type'] = $validated['media_type'] ?? 'movie';

            // Use updateOrCreate to handle duplicates gracefully
            $like = UserMovieLike::updateOrCreate(
                [
                    'user_id' => $validated['user_id'],
                    'movie_id' => $validated['movie_id']
                ],
                $validated
            );

            return response()->json([
                'message' => 'Movie liked successfully',
                'like' => $like
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to like movie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Unlike a movie
     */
    public function destroy(int $movieId): JsonResponse
    {
        try {
            $deleted = UserMovieLike::where('user_id', Auth::id())
                ->where('movie_id', $movieId)
                ->delete();

            if ($deleted) {
                return response()->json(['message' => 'Movie unliked successfully']);
            } else {
                return response()->json(['message' => 'Movie was not liked'], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to unlike movie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all liked movies for the current user
     */
    public function index(): JsonResponse
    {
        try {
            $likes = UserMovieLike::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json(['likes' => $likes]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch liked movies',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the liked movies page
     */
    public function page()
    {
        $likes = UserMovieLike::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return \Inertia\Inertia::render('liked-movies/index', [
            'likes' => $likes
        ]);
    }
} 