import AppLayout from '@/layouts/app-layout';
import { AppHeaderNetflix } from '@/components/app-header-netflix';
import { type BreadcrumbItem, type Movie } from '@/types';
import { Head } from '@inertiajs/react';
import { AppHero } from '@/components/app-hero';
import { MovieSlider } from '@/components/movie-slider';
import { MovieModal } from '@/components/movie-modal';
import { useState } from 'react';


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
}

export default function Home({ 
    trendingMovies, 
    upcomingMovies, 
    popularMovies, 
    topRatedMovies,
    trendingTvShows,
    airingTodayTvShows,
    popularTvShows,
    topRatedTvShows
}: MoviesProps) {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    // Use trending movies or TV shows for hero, whichever has content
    const heroContent = trendingMovies?.[0] || trendingTvShows?.[0];

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Browse" />
                <div className='relative h-screen text-white '>
                    <AppHeaderNetflix breadcrumbs={breadcrumbs} />
                    {heroContent && <AppHero movie={heroContent} onMoreInfoClick={handleMovieClick}/>}
                </div>
                <div className="flex flex-col gap-10 bg-black py-10 text-white">
                    {/* Movies Sections */}
                    {trendingMovies?.length > 0 && (
                        <MovieSlider category="Trending Movies" movies={trendingMovies} onMovieClick={handleMovieClick} />
                    )}
                    {upcomingMovies?.length > 0 && (
                        <MovieSlider category="Upcoming Movies" movies={upcomingMovies} onMovieClick={handleMovieClick} />
                    )}
                    {popularMovies?.length > 0 && (
                        <MovieSlider category="Popular Movies" movies={popularMovies} onMovieClick={handleMovieClick} />
                    )}
                    {topRatedMovies?.length > 0 && (
                        <MovieSlider category="Top Rated Movies" movies={topRatedMovies} onMovieClick={handleMovieClick} />
                    )}
                    
                    {/* TV Shows Sections */}
                    {trendingTvShows?.length > 0 && (
                        <MovieSlider category="Trending TV Shows" movies={trendingTvShows} onMovieClick={handleMovieClick} />
                    )}
                    {airingTodayTvShows?.length > 0 && (
                        <MovieSlider category="Airing Today" movies={airingTodayTvShows} onMovieClick={handleMovieClick} />
                    )}
                    {popularTvShows?.length > 0 && (
                        <MovieSlider category="Popular TV Shows" movies={popularTvShows} onMovieClick={handleMovieClick} />
                    )}
                    {topRatedTvShows?.length > 0 && (
                        <MovieSlider category="Top Rated TV Shows" movies={topRatedTvShows} onMovieClick={handleMovieClick} />
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
