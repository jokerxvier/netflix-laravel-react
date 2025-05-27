<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Services\SearchService;

class SearchController extends Controller
{
    public function index(Request $request, SearchService $searchService)
    {
        $query = $request->get('q', '');
        $type = $request->get('type', 'all'); // all, movie, tv
        $page = (int) $request->get('page', 1);

        $results = [];
        $trendingContent = [];

        // If no search query, show trending content
        if (empty(trim($query))) {
            $trendingContent = $searchService->getTrendingContent();
        } else {
            // Perform search based on type
            switch ($type) {
                case 'movie':
                    $results = $searchService->searchMovies($query, $page);
                    break;
                case 'tv':
                    $results = $searchService->searchTvShows($query, $page);
                    break;
                default:
                    $results = $searchService->searchMulti($query, $page);
                    break;
            }
        }

        return Inertia::render('search/index', [
            'query' => $query,
            'type' => $type,
            'results' => $results['results'] ?? [],
            'totalPages' => $results['total_pages'] ?? 0,
            'totalResults' => $results['total_results'] ?? 0,
            'currentPage' => $results['page'] ?? 1,
            'trendingContent' => $trendingContent['results'] ?? [],
        ]);
    }
} 