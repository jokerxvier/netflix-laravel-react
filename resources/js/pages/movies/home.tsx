import AppLayout from '@/layouts/app-layout';
import { AppHeaderNetflix } from '@/components/app-header-netflix';
import { type BreadcrumbItem, type Movie } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AppHero } from '@/components/app-hero';
import { MovieSlider } from '@/components/movie-slider';
import { MovieModal } from '@/components/movie-modal';
import { HeroSkeleton } from '@/components/skeletons/hero-skeleton';
import { MovieSliderSkeleton } from '@/components/skeletons/movie-slider-skeleton';
import { useState, useEffect } from 'react';
import { Filter, RefreshCw } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Browse',
        href: '/browse',
    },
];

type MoviesProps = {
    trendingMovies: Movie[];
    upcomingMovies: Movie[];
    popularMovies: Movie[];
    topRatedMovies: Movie[];
    trendingTvShows: Movie[];
    airingTodayTvShows: Movie[];
    popularTvShows: Movie[];
    topRatedTvShows: Movie[];
    currentFilter?: string;
    isLoading?: boolean;
}

export default function Home({ 
    trendingMovies, 
    upcomingMovies, 
    popularMovies, 
    topRatedMovies,
    trendingTvShows,
    airingTodayTvShows,
    popularTvShows,
    topRatedTvShows,
    currentFilter = 'all',
    isLoading = false
}: MoviesProps) {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contentFilter, setContentFilter] = useState<'all' | 'movies' | 'tv'>(currentFilter as 'all' | 'movies' | 'tv');
    const [loading, setLoading] = useState(isLoading);

    // Sync with URL parameters
    useEffect(() => {
        setContentFilter(currentFilter as 'all' | 'movies' | 'tv');
    }, [currentFilter]);

    // Simulate loading state for demonstration
    useEffect(() => {
        if (isLoading) {
            setLoading(true);
            // Simulate API call delay
            const timer = setTimeout(() => {
                setLoading(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    const handleFilterChange = (filter: 'all' | 'movies' | 'tv') => {
        setContentFilter(filter);
        setLoading(true);
        // Update URL with filter parameter
        router.get('/browse', { filter }, { 
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false)
        });
    };

    // Demo function to trigger loading state
    const triggerLoadingDemo = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };

    // Use trending movies or TV shows for hero, whichever has content
    const heroContent = trendingMovies?.[0] || trendingTvShows?.[0];

    // Filter content based on selected filter
    const shouldShowMovies = contentFilter === 'all' || contentFilter === 'movies';
    const shouldShowTvShows = contentFilter === 'all' || contentFilter === 'tv';

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Browse" />
                <div className='relative h-screen text-white '>
                    <AppHeaderNetflix breadcrumbs={breadcrumbs} />
                    {loading ? (
                        <HeroSkeleton />
                    ) : (
                        heroContent && <AppHero movie={heroContent} onMoreInfoClick={handleMovieClick}/>
                    )}
                </div>
                
                {/* Filter Controls */}
                <div className="bg-black text-white px-5 md:px-20 pt-10 pb-5">
                    {/* Demo Loading Button */}
                    {/* <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={triggerLoadingDemo}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Loading...' : 'Demo Loading State'}
                        </button>
                        <span className="text-sm text-gray-400">
                            Click to see skeleton loading animation
                        </span>
                    </div> */}
                    
                    {/* <div className="flex items-center gap-4 mb-6">
                        <Filter className="size-5 text-gray-400" />
                        <span className="text-lg font-semibold">Filter Content:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    contentFilter === 'all' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => handleFilterChange('movies')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    contentFilter === 'movies' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                Movies
                            </button>
                            <button
                                onClick={() => handleFilterChange('tv')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    contentFilter === 'tv' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                TV Shows
                            </button>
                        </div>
                    </div> */}
                </div>

                <div className="flex flex-col gap-10 bg-black pb-10 text-white">
                    {loading ? (
                        // Show skeleton loading states
                        <>
                            <MovieSliderSkeleton />
                            <MovieSliderSkeleton />
                            <MovieSliderSkeleton />
                            <MovieSliderSkeleton />
                        </>
                    ) : (
                        <>
                            {/* Movies Sections */}
                            {shouldShowMovies && trendingMovies?.length > 0 && (
                                <MovieSlider category="Trending Movies" movies={trendingMovies} onMovieClick={handleMovieClick} />
                            )}
                            {shouldShowMovies && upcomingMovies?.length > 0 && (
                                <MovieSlider category="Upcoming Movies" movies={upcomingMovies} onMovieClick={handleMovieClick} />
                            )}
                            {shouldShowMovies && popularMovies?.length > 0 && (
                                <MovieSlider category="Popular Movies" movies={popularMovies} onMovieClick={handleMovieClick} />
                            )}
                            {shouldShowMovies && topRatedMovies?.length > 0 && (
                                <MovieSlider category="Top Rated Movies" movies={topRatedMovies} onMovieClick={handleMovieClick} />
                            )}
                            
                            {/* TV Shows Sections */}
                            {shouldShowTvShows && trendingTvShows?.length > 0 && (
                                <MovieSlider category="Trending TV Shows" movies={trendingTvShows} onMovieClick={handleMovieClick} />
                            )}
                            {shouldShowTvShows && airingTodayTvShows?.length > 0 && (
                                <MovieSlider category="Airing Today" movies={airingTodayTvShows} onMovieClick={handleMovieClick} />
                            )}
                            {shouldShowTvShows && popularTvShows?.length > 0 && (
                                <MovieSlider category="Popular TV Shows" movies={popularTvShows} onMovieClick={handleMovieClick} />
                            )}
                            {shouldShowTvShows && topRatedTvShows?.length > 0 && (
                                <MovieSlider category="Top Rated TV Shows" movies={topRatedTvShows} onMovieClick={handleMovieClick} />
                            )}
                            
                            {/* No content message */}
                            {((contentFilter === 'movies' && !trendingMovies?.length && !upcomingMovies?.length && !popularMovies?.length && !topRatedMovies?.length) ||
                              (contentFilter === 'tv' && !trendingTvShows?.length && !airingTodayTvShows?.length && !popularTvShows?.length && !topRatedTvShows?.length)) && (
                                <div className="text-center py-20 px-5 md:px-20">
                                    <h2 className="text-2xl font-bold text-gray-400 mb-4">
                                        No {contentFilter === 'movies' ? 'Movies' : 'TV Shows'} Available
                                    </h2>
                                    <p className="text-gray-500">
                                        Try switching to a different filter or check back later.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
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
