import AppLayout from '@/layouts/app-layout';
import { AppHeaderNetflix } from '@/components/app-header-netflix';
import { type BreadcrumbItem, type Movie } from '@/types';
import { Head } from '@inertiajs/react';
import { MovieModal } from '@/components/movie-modal';
import { useState } from 'react';
import { getImageUrl } from '@/lib/utils';
import { Heart, Play } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Liked Movies',
        href: '/liked-movies',
    },
];

interface LikedMovie {
    id: number;
    movie_id: number;
    movie_title: string;
    movie_poster_path: string | null;
    movie_backdrop_path: string | null;
    movie_overview: string | null;
    movie_release_date: string | null;
    media_type: string;
    created_at: string;
}

type LikedMoviesProps = {
    likes: LikedMovie[];
}

export default function LikedMovies({ likes }: LikedMoviesProps) {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMovieClick = (likedMovie: LikedMovie) => {
        // Convert LikedMovie to Movie format for the modal
        const movie: Movie = {
            id: likedMovie.movie_id,
            title: likedMovie.movie_title,
            name: likedMovie.movie_title,
            overview: likedMovie.movie_overview || '',
            poster_path: likedMovie.movie_poster_path || '',
            backdrop_path: likedMovie.movie_backdrop_path || '',
            release_date: likedMovie.movie_release_date || '',
            first_air_date: likedMovie.movie_release_date || '',
            adult: false,
            media_type: likedMovie.media_type as 'movie' | 'tv',
        };
        
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    return (
        <AppLayout>
            <Head title="Liked Movies" />
            
            <AppHeaderNetflix breadcrumbs={breadcrumbs} />
            
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Heart className="w-8 h-8 text-red-500 fill-current" />
                        <h1 className="text-4xl font-bold">Liked Movies</h1>
                    </div>
                    
                    {likes.length === 0 ? (
                        <div className="text-center py-16">
                            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-400 mb-2">No liked movies yet</h2>
                            <p className="text-gray-500">Start liking movies to see them here!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                            {likes.map((likedMovie) => (
                                <div
                                    key={likedMovie.id}
                                    className="group cursor-pointer transition-transform duration-300 hover:scale-105"
                                    onClick={() => handleMovieClick(likedMovie)}
                                >
                                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                                        {likedMovie.movie_poster_path ? (
                                            <img
                                                src={getImageUrl(likedMovie.movie_poster_path, 'w500')}
                                                alt={likedMovie.movie_title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                                <Play className="w-12 h-12 text-gray-500" />
                                            </div>
                                        )}
                                        
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                                            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        
                                        {/* Like indicator */}
                                        <div className="absolute top-2 right-2 bg-red-600 rounded-full p-1">
                                            <Heart className="w-4 h-4 text-white fill-current" />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-2">
                                        <h3 className="text-sm font-medium line-clamp-2 text-gray-200">
                                            {likedMovie.movie_title}
                                        </h3>
                                        {likedMovie.movie_release_date && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(likedMovie.movie_release_date).getFullYear()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <MovieModal
                movie={selectedMovie}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </AppLayout>
    );
} 