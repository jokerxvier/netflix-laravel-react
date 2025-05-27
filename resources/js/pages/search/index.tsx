import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AppHeaderNetflix } from '@/components/app-header-netflix';
import { MovieModal } from '@/components/movie-modal';
import { Search, Filter, X } from 'lucide-react';
import { type Movie, type BreadcrumbItem } from '@/types';
import { getImageUrl } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Search',
        href: '/search',
    },
];

interface SearchProps {
    query: string;
    type: string;
    results: Movie[];
    totalPages: number;
    totalResults: number;
    currentPage: number;
    trendingContent: Movie[];
}

export default function SearchPage({ 
    query, 
    type, 
    results, 
    totalPages, 
    totalResults, 
    currentPage, 
    trendingContent 
}: SearchProps) {
    const [searchQuery, setSearchQuery] = useState(query);
    const [searchType, setSearchType] = useState(type);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim() && searchQuery !== query) {
                router.get('/search', { 
                    q: searchQuery.trim(), 
                    type: searchType 
                });
            } else if (!searchQuery.trim() && query) {
                // Clear search if input is empty
                router.get('/search');
            }
        }, 500); // 500ms debounce delay

        return () => clearTimeout(timeoutId);
    }, [searchQuery, searchType, query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/search', { 
                q: searchQuery.trim(), 
                type: searchType 
            });
        }
    };

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    const handleTypeFilter = (newType: string) => {
        setSearchType(newType);
        if (searchQuery.trim()) {
            router.get('/search', { 
                q: searchQuery.trim(), 
                type: newType 
            });
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        router.get('/search');
    };

    const loadMoreResults = () => {
        if (currentPage < totalPages) {
            router.get('/search', { 
                q: searchQuery, 
                type: searchType, 
                page: currentPage + 1 
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const displayContent = query ? results : trendingContent;
    const hasContent = displayContent && displayContent.length > 0;

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Search" />
                <div className="min-h-screen bg-black text-white">
                    <AppHeaderNetflix breadcrumbs={breadcrumbs} />
                    
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        {/* Search Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-6">
                                {query ? `Search Results` : 'Search Movies & TV Shows'}
                            </h1>
                            
                            {/* Search Form */}
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="relative max-w-2xl">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for movies, TV shows..."
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            <X className="size-5" />
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Filters */}
                            <div className="flex items-center gap-4 mb-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <Filter className="size-4" />
                                    Filters
                                </button>
                                
                                {showFilters && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleTypeFilter('all')}
                                            className={`px-4 py-2 rounded-lg transition-colors ${
                                                searchType === 'all' 
                                                    ? 'bg-red-600 text-white' 
                                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            }`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => handleTypeFilter('movie')}
                                            className={`px-4 py-2 rounded-lg transition-colors ${
                                                searchType === 'movie' 
                                                    ? 'bg-red-600 text-white' 
                                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            }`}
                                        >
                                            Movies
                                        </button>
                                        <button
                                            onClick={() => handleTypeFilter('tv')}
                                            className={`px-4 py-2 rounded-lg transition-colors ${
                                                searchType === 'tv' 
                                                    ? 'bg-red-600 text-white' 
                                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            }`}
                                        >
                                            TV Shows
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Results Info */}
                            {query && (
                                <div className="text-gray-400 mb-6">
                                    {totalResults > 0 ? (
                                        <p>Found {totalResults} results for "{query}"</p>
                                    ) : (
                                        <p>No results found for "{query}"</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Content Grid */}
                        {hasContent ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                                    {displayContent.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group cursor-pointer"
                                            onClick={() => handleMovieClick(item)}
                                        >
                                            <div className="relative overflow-hidden rounded-lg bg-gray-800">
                                                <img
                                                    src={getImageUrl(item.poster_path || item.backdrop_path, 'w500')}
                                                    alt={item.title || item.name}
                                                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-110"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/assets/netflix-logo.png';
                                                    }}
                                                />
                                                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
                                                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                                                            {item.title || item.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-300">
                                                            {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
                                                        </p>
                                                        {item.media_type && (
                                                            <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-xs rounded">
                                                                {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 px-1">
                                                <h3 className="text-sm font-medium line-clamp-2 text-gray-200">
                                                    {item.title || item.name}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Load More Button */}
                                {query && currentPage < totalPages && (
                                    <div className="text-center">
                                        <button
                                            onClick={loadMoreResults}
                                            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                        >
                                            Load More Results
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                {query ? (
                                    <div>
                                        <Search className="size-16 text-gray-600 mx-auto mb-4" />
                                        <h2 className="text-xl font-semibold text-gray-400 mb-2">
                                            No results found
                                        </h2>
                                        <p className="text-gray-500">
                                            Try searching with different keywords or check your spelling.
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <Search className="size-16 text-gray-600 mx-auto mb-4" />
                                        <h2 className="text-xl font-semibold text-gray-400 mb-2">
                                            Start searching
                                        </h2>
                                        <p className="text-gray-500">
                                            Search for your favorite movies and TV shows.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Trending Section (when no search) */}
                        {!query && trendingContent.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {trendingContent.slice(0, 12).map((item) => (
                                        <div
                                            key={item.id}
                                            className="group cursor-pointer"
                                            onClick={() => handleMovieClick(item)}
                                        >
                                            <div className="relative overflow-hidden rounded-lg bg-gray-800">
                                                <img
                                                    src={getImageUrl(item.poster_path || item.backdrop_path, 'w500')}
                                                    alt={item.title || item.name}
                                                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-110"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/assets/netflix-logo.png';
                                                    }}
                                                />
                                                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
                                                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                                                            {item.title || item.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-300">
                                                            {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
                                                        </p>
                                                        {item.media_type && (
                                                            <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-xs rounded">
                                                                {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 px-1">
                                                <h3 className="text-sm font-medium line-clamp-2 text-gray-200">
                                                    {item.title || item.name}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AppLayout>

            <MovieModal 
                movie={selectedMovie}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </>
    );
} 