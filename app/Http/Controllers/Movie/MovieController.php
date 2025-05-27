<?php

namespace App\Http\Controllers\Movie;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Services\MovieService;
use App\Http\Services\TvService;

class MovieController extends Controller
{
    public function index(MovieService $movieService, TvService $tvService)
    {
        $trendingMovies = $movieService->getTrendingMovies();
        $upcomingMovies = $movieService->getUpcomingMovies();
        $popularMovies = $movieService->getPopularMovies();
        $topRatedMovies = $movieService->getTopRatedMovies();
        
        $trendingTvShows = $tvService->getTrendingTvShows();
        $airingTodayTvShows = $tvService->getAiringTodayTvShows();
        $popularTvShows = $tvService->getPopularTvShows();
        $topRatedTvShows = $tvService->getTopRatedTvShows();
    
        return Inertia::render('movies/home', [
            'trendingMovies' => $trendingMovies['results'] ?? [],
            'upcomingMovies' => $upcomingMovies['results'] ?? [],
            'popularMovies' => $popularMovies['results'] ?? [],
            'topRatedMovies' => $topRatedMovies['results'] ?? [],
            'trendingTvShows' => $trendingTvShows['results'] ?? [],
            'airingTodayTvShows' => $airingTodayTvShows['results'] ?? [],
            'popularTvShows' => $popularTvShows['results'] ?? [],
            'topRatedTvShows' => $topRatedTvShows['results'] ?? [],
        ]);
    }
}
