<?php

namespace App\Http\Services;
use Illuminate\Support\Facades\Http;

class SearchService
{
    private $tmdbBaseUrl;
    private $tmdbApiKey;

    public function __construct() {
        $this->tmdbBaseUrl = config('services.tmdb.base_url');
        $this->tmdbApiKey = config('services.tmdb.api_key');
    }

    public function searchMulti(string $query, int $page = 1): array
    {
        if (empty(trim($query))) {
            return [
                'results' => [],
                'total_pages' => 0,
                'total_results' => 0,
                'page' => 1
            ];
        }

        $response = Http::get($this->tmdbBaseUrl . '/search/multi', [
            'api_key' => $this->tmdbApiKey,
            'query' => $query,
            'page' => $page,
            'include_adult' => false
        ]);

        if ($response->successful()) {
            $data = $response->json();
            
            // Filter out person results, keep only movies and TV shows
            $filteredResults = array_filter($data['results'] ?? [], function($item) {
                return in_array($item['media_type'] ?? '', ['movie', 'tv']);
            });

            return [
                'results' => array_values($filteredResults),
                'total_pages' => $data['total_pages'] ?? 0,
                'total_results' => count($filteredResults),
                'page' => $data['page'] ?? 1
            ];
        }

        return [
            'results' => [],
            'total_pages' => 0,
            'total_results' => 0,
            'page' => 1
        ];
    }

    public function searchMovies(string $query, int $page = 1): array
    {
        if (empty(trim($query))) {
            return [
                'results' => [],
                'total_pages' => 0,
                'total_results' => 0,
                'page' => 1
            ];
        }

        $response = Http::get($this->tmdbBaseUrl . '/search/movie', [
            'api_key' => $this->tmdbApiKey,
            'query' => $query,
            'page' => $page,
            'include_adult' => false
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'results' => [],
            'total_pages' => 0,
            'total_results' => 0,
            'page' => 1
        ];
    }

    public function searchTvShows(string $query, int $page = 1): array
    {
        if (empty(trim($query))) {
            return [
                'results' => [],
                'total_pages' => 0,
                'total_results' => 0,
                'page' => 1
            ];
        }

        $response = Http::get($this->tmdbBaseUrl . '/search/tv', [
            'api_key' => $this->tmdbApiKey,
            'query' => $query,
            'page' => $page,
            'include_adult' => false
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'results' => [],
            'total_pages' => 0,
            'total_results' => 0,
            'page' => 1
        ];
    }

    public function getTrendingContent(): array
    {
        $response = Http::get($this->tmdbBaseUrl . '/trending/all/day', [
            'api_key' => $this->tmdbApiKey
        ]);

        if ($response->successful()) {
            $data = $response->json();
            
            // Filter out person results
            $filteredResults = array_filter($data['results'] ?? [], function($item) {
                return in_array($item['media_type'] ?? '', ['movie', 'tv']);
            });

            return [
                'results' => array_values($filteredResults),
                'total_pages' => $data['total_pages'] ?? 0,
                'total_results' => count($filteredResults),
                'page' => $data['page'] ?? 1
            ];
        }

        return [
            'results' => [],
            'total_pages' => 0,
            'total_results' => 0,
            'page' => 1
        ];
    }
} 