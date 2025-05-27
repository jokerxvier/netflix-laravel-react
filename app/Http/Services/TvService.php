<?php

namespace App\Http\Services;
use Illuminate\Support\Facades\Http;

class TvService
{
    public function getTrendingTvShows(): array
    {
        $response = Http::get(config('services.tmdb.base_url') . '/trending/tv/week', [
            'api_key' => config('services.tmdb.api_key')
        ]);

        if ($response->successful()) {
            return $response->json();
        }
        return [];
    }

    public function getAiringTodayTvShows(): array
    {
        $response = Http::get(config('services.tmdb.base_url') . '/tv/airing_today', [
            'api_key' => config('services.tmdb.api_key')
        ]);
        
        if ($response->successful()) {
            return $response->json();
        }
        return [];
    }

    public function getOnTheAirTvShows(): array
    {
        $response = Http::get(config('services.tmdb.base_url') . '/tv/on_the_air', [
            'api_key' => config('services.tmdb.api_key')
        ]);
        
        if ($response->successful()) {
            return $response->json();
        }
        return [];
    }

    public function getPopularTvShows(): array
    {
        $response = Http::get(config('services.tmdb.base_url') . '/tv/popular', [
            'api_key' => config('services.tmdb.api_key')
        ]);
        
        if ($response->successful()) {
            return $response->json();
        }
        return [];
    }
    
    public function getTopRatedTvShows(): array
    {
        $response = Http::get(config('services.tmdb.base_url') . '/tv/top_rated', [
            'api_key' => config('services.tmdb.api_key')
        ]);
        
        if ($response->successful()) {
            return $response->json();
        }
        return [];
    }
} 