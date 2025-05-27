<?php

namespace App\Http\Services;
use Illuminate\Support\Facades\Http;

class MovieService
{
    private $tmdbBaseUrl;
    private $tmdbApiKey;

    public function __construct() 
    {
        $this->tmdbBaseUrl = config('services.tmdb.base_url');
        $this->tmdbApiKey = config('services.tmdb.api_key');
    }
    public function getTrendingMovies(): array
    {
        $response = Http::get($this->tmdbBaseUrl . '/trending/movie/week', [
            'api_key' => $this->tmdbApiKey
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return $data;
        }
        return [];
    }

    public function getUpcomingMovies(): array
    {
        $response = Http::get($this->tmdbBaseUrl . '/movie/upcoming', [
            'api_key' => $this->tmdbApiKey
        ]);
        if ($response->successful()) {
            $data = $response->json();
            return $data;
        }
        return [];
    }

    public function getPopularMovies(): array
    {
        $response = Http::get($this->tmdbBaseUrl . '/movie/popular', [
            'api_key' => $this->tmdbApiKey
        ]);
        if ($response->successful()) {
            $data = $response->json();
            return $data;
        }
        return [];
    }
    
    public function getTopRatedMovies(): array
    {
        $response = Http::get($this->tmdbBaseUrl . '/movie/top_rated', [
            'api_key' => $this->tmdbApiKey
        ]);
        if ($response->successful()) {
            $data = $response->json();
            return $data;
        }
        return [];
    }
    
}