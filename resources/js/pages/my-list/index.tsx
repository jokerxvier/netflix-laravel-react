import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AppHeaderNetflix } from '@/components/app-header-netflix';
import { MovieModal } from '@/components/movie-modal';
import { type Movie, type BreadcrumbItem } from '@/types';
import { getImageUrl } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My List',
        href: '/my-list',
    },
];

interface MyListProps {
    movies: Array<{
        id: number;
        movie_id: number;
        movie_title: string;
        movie_poster_path: string | null;
        movie_backdrop_path: string | null;
        movie_overview: string | null;
        movie_release_date: string | null;
        media_type: string;
        created_at: string;
    }>;
}

export default function MyListPage({ movies }: MyListProps) {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [movieList, setMovieList] = useState(movies);

    const handleMovieClick = (movieData: any) => {
        // Convert the movie list item back to Movie format
        const movie: Movie = {
            id: movieData.movie_id,
            title: movieData.movie_title,
            name: movieData.movie_title,
            overview: movieData.movie_overview || '',
            poster_path: movieData.movie_poster_path || '',
            backdrop_path: movieData.movie_backdrop_path || '',
            release_date: movieData.movie_release_date || '',
            first_air_date: movieData.movie_release_date || '',
            adult: false,
            media_type: movieData.media_type as 'movie' | 'tv',
        };
        
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    const handleRemoveFromList = async (movieId: number) => {
        try {
            const response = await fetch(`/my-list/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setMovieList(prev => prev.filter(movie => movie.movie_id !== movieId));
            }
        } catch (error) {
            console.error('Failed to remove from list:', error);
        }
    };

    return (
        <>
            <Head title="My List" />
            
            <AppLayout>
                <AppHeaderNetflix breadcrumbs={breadcrumbs} />
                
                <div className="min-h-screen bg-black text-white">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-4xl font-bold mb-8">My List</h1>
                        
                        {movieList.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">📺</div>
                                <h2 className="text-2xl font-semibold mb-2">Your list is empty</h2>
                                <p className="text-gray-400">
                                    Add movies and TV shows to your list to watch them later.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {movieList.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="group relative cursor-pointer"
                                    >
                                        <div 
                                            className="relative overflow-hidden rounded-lg bg-gray-800"
                                            onClick={() => handleMovieClick(movie)}
                                        >
                                            <img
                                                src={getImageUrl(movie.movie_poster_path || movie.movie_backdrop_path, 'w500')}
                                                alt={movie.movie_title}
                                                className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-110"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/assets/netflix-logo.png';
                                                }}
                                            />
                                            
                                            {/* Remove button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveFromList(movie.movie_id);
                                                }}
                                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove from My List"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="mt-2 px-1">
                                            <h3 className="text-sm font-medium line-clamp-2 text-gray-200">
                                                {movie.movie_title}
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {movie.movie_release_date?.split('-')[0]}
                                            </p>
                                        </div>
                                    </div>
                                ))}
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