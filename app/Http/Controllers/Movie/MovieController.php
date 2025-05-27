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
    public function index(Request $request, MovieService $movieService, TvService $tvService)
    {
        $filter = $request->query('filter', 'all'); // 'all', 'movies', 'tv'
        
        $data = [];
        
        // Always fetch movies data if filter is 'all' or 'movies'
        if ($filter === 'all' || $filter === 'movies') {
            $trendingMovies = $movieService->getTrendingMovies();
            $upcomingMovies = $movieService->getUpcomingMovies();
            $popularMovies = $movieService->getPopularMovies();
            $topRatedMovies = $movieService->getTopRatedMovies();
            
            $data['trendingMovies'] = $trendingMovies['results'] ?? [];
            $data['upcomingMovies'] = $upcomingMovies['results'] ?? [];
            $data['popularMovies'] = $popularMovies['results'] ?? [];
            $data['topRatedMovies'] = $topRatedMovies['results'] ?? [];
        } else {
            $data['trendingMovies'] = [];
            $data['upcomingMovies'] = [];
            $data['popularMovies'] = [];
            $data['topRatedMovies'] = [];
        }
        
        // Always fetch TV shows data if filter is 'all' or 'tv'
        if ($filter === 'all' || $filter === 'tv') {
            $trendingTvShows = $tvService->getTrendingTvShows();
            $airingTodayTvShows = $tvService->getAiringTodayTvShows();
            $popularTvShows = $tvService->getPopularTvShows();
            $topRatedTvShows = $tvService->getTopRatedTvShows();
            
            $data['trendingTvShows'] = $trendingTvShows['results'] ?? [];
            $data['airingTodayTvShows'] = $airingTodayTvShows['results'] ?? [];
            $data['popularTvShows'] = $popularTvShows['results'] ?? [];
            $data['topRatedTvShows'] = $topRatedTvShows['results'] ?? [];
        } else {
            $data['trendingTvShows'] = [];
            $data['airingTodayTvShows'] = [];
            $data['popularTvShows'] = [];
            $data['topRatedTvShows'] = [];
        }
        
        $data['currentFilter'] = $filter;
    
        return Inertia::render('movies/home', $data);
    }
}
