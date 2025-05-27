import { useEffect, useRef } from 'react';
import { type Movie } from '@/types';
import { X, Play, Plus, Volume2, VolumeX, Check, Heart } from 'lucide-react';
import { useState } from 'react';
import { getMovieUrl, getImageUrl } from '@/lib/utils';
import { router } from '@inertiajs/react';

interface MovieModalProps {
    movie: Movie | null;
    isOpen: boolean;
    onClose: () => void;
}

export function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
    const [isMuted, setIsMuted] = useState(true);
    const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
    const [isInList, setIsInList] = useState(false);
    const [isAddingToList, setIsAddingToList] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const fetchTrailer = async (movieId: number) => {
        setIsLoadingTrailer(true);
        try {
            const response = await fetch(
                getMovieUrl(`/movie/${movieId}/videos`)
            );
            const data = await response.json();
            
            // Find YouTube trailer
            const trailer = data.results?.find(
                (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
            );
            
            if (trailer) {
                setTrailerKey(trailer.key);
                setIsPlayingTrailer(true);
            }
        } catch (error) {
            console.error('Failed to fetch trailer:', error);
        } finally {
            setIsLoadingTrailer(false);
        }
    };

    const checkIfInList = async (movieId: number) => {
        try {
            const response = await fetch(`/my-list/check/${movieId}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            const data = await response.json();
            setIsInList(data.in_list);
        } catch (error) {
            console.error('Failed to check if movie is in list:', error);
        }
    };

    const handleAddToList = async () => {
        if (!movie) return;
        
        setIsAddingToList(true);
        try {
            const response = await fetch('/my-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    movie_id: movie.id,
                    movie_title: movie.title || movie.name,
                    movie_poster_path: movie.poster_path,
                    movie_backdrop_path: movie.backdrop_path,
                    movie_overview: movie.overview,
                    movie_release_date: movie.release_date || movie.first_air_date,
                    media_type: movie.media_type || 'movie',
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                setIsInList(true);
            } else {
                console.error('Failed to add to list:', data.message);
            }
        } catch (error) {
            console.error('Failed to add to list:', error);
        } finally {
            setIsAddingToList(false);
        }
    };

    const handleRemoveFromList = async () => {
        if (!movie) return;
        
        setIsAddingToList(true);
        try {
            const response = await fetch(`/my-list/${movie.id}`, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            
            if (response.ok) {
                setIsInList(false);
            } else {
                console.error('Failed to remove from list:', data.message);
            }
        } catch (error) {
            console.error('Failed to remove from list:', error);
        } finally {
            setIsAddingToList(false);
        }
    };

    const handlePlayTrailer = () => {
        if (movie) {
            if (movie.trailer) {
                setTrailerKey(movie.trailer);
                setIsPlayingTrailer(true);
            } else {
                fetchTrailer(movie.id);
            }
        }
    };

    const handleStopTrailer = () => {
        setIsPlayingTrailer(false);
        setTrailerKey(null);
    };

    const checkIfLiked = async (movieId: number) => {
        try {
            const response = await fetch(`/movie-likes/check/${movieId}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            const data = await response.json();
            setIsLiked(data.is_liked);
        } catch (error) {
            console.error('Failed to check if movie is liked:', error);
        }
    };

    const handleLikeMovie = async () => {
        if (!movie) return;
        
        setIsLiking(true);
        try {
            const response = await fetch('/movie-likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    movie_id: movie.id,
                    movie_title: movie.title || movie.name,
                    movie_poster_path: movie.poster_path,
                    movie_backdrop_path: movie.backdrop_path,
                    movie_overview: movie.overview,
                    movie_release_date: movie.release_date || movie.first_air_date,
                    media_type: movie.media_type || 'movie',
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                setIsLiked(true);
            } else {
                console.error('Failed to like movie:', data.message);
            }
        } catch (error) {
            console.error('Failed to like movie:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleUnlikeMovie = async () => {
        if (!movie) return;
        
        setIsLiking(true);
        try {
            const response = await fetch(`/movie-likes/${movie.id}`, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            
            if (response.ok) {
                setIsLiked(false);
            } else {
                console.error('Failed to unlike movie:', data.message);
            }
        } catch (error) {
            console.error('Failed to unlike movie:', error);
        } finally {
            setIsLiking(false);
        }
    };

    // Check if movie is in list when modal opens
    useEffect(() => {
        if (isOpen && movie) {
            checkIfInList(movie.id);
            checkIfLiked(movie.id);
        }
    }, [isOpen, movie]);

    // Update YouTube iframe when mute state changes
    useEffect(() => {
        if (isPlayingTrailer && trailerKey) {
            const iframe = document.querySelector('iframe');
            if (iframe) {
                const currentSrc = iframe.src;
                const url = new URL(currentSrc);
                url.searchParams.set('mute', isMuted ? '1' : '0');
                iframe.src = url.toString();
            }
        }
    }, [isMuted, isPlayingTrailer, trailerKey]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            // Reset trailer state when modal closes
            setIsPlayingTrailer(false);
            setTrailerKey(null);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !movie) return null;

    const releaseYear = movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0] || 'N/A';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
            <div 
                ref={modalRef}
                className={`relative bg-zinc-900 rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto transition-all duration-300 ${
                    isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
                }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-zinc-800 hover:bg-zinc-700 rounded-full p-2 transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                {/* Hero Section */}
                <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        {isPlayingTrailer && trailerKey ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0`}
                                title={movie.title || movie.name}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <img
                                src={getImageUrl(movie.backdrop_path, 'w1280')}
                                alt={movie.title || movie.name}
                                className="w-full h-full object-cover"
                            />
                        )}
                        
                        {/* Gradient Overlay */}
                        {!isPlayingTrailer && (
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                        )}
                        
                        {/* Action Buttons */}
                        <div className="absolute bottom-6 left-6 flex items-center gap-3">
                            {isPlayingTrailer ? (
                                <button
                                    onClick={handleStopTrailer}
                                    className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-bold py-3 px-6 rounded transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                    Stop
                                </button>
                            ) : (
                                <button
                                    onClick={handlePlayTrailer}
                                    disabled={isLoadingTrailer}
                                    className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-bold py-3 px-6 rounded transition-colors disabled:opacity-50"
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    {isLoadingTrailer ? 'Loading...' : 'Play Trailer'}
                                </button>
                            )}
                            
                            <button 
                                onClick={isInList ? handleRemoveFromList : handleAddToList}
                                disabled={isAddingToList}
                                className={`p-3 rounded-full transition-colors disabled:opacity-50 ${
                                    isInList 
                                        ? 'bg-white text-black hover:bg-gray-200' 
                                        : 'bg-zinc-700 hover:bg-zinc-600 text-white'
                                }`}
                                title={isInList ? 'Remove from My List' : 'Add to My List'}
                            >
                                {isAddingToList ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : isInList ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Plus className="w-5 h-5" />
                                )}
                            </button>
                            
                            <button 
                                onClick={isLiked ? handleUnlikeMovie : handleLikeMovie}
                                disabled={isLiking}
                                className={`p-3 rounded-full transition-colors disabled:opacity-50 ${
                                    isLiked 
                                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                                        : 'bg-zinc-700 hover:bg-zinc-600 text-white'
                                }`}
                                title={isLiked ? 'Unlike this movie' : 'Like this movie'}
                            >
                                {isLiking ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : isLiked ? (
                                    <Heart className="w-5 h-5 fill-current" />
                                ) : (
                                    <Heart className="w-5 h-5" />
                                )}
                            </button>
                            
                            <button 
                                onClick={() => setIsMuted(!isMuted)}
                                className="bg-zinc-700 hover:bg-zinc-600 text-white p-3 rounded-full transition-colors ml-auto mr-6"
                            >
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 text-white">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-green-500 font-semibold">98% Match</span>
                                <span className="text-gray-400">{releaseYear}</span>
                                <span className="border border-gray-400 text-gray-400 px-1 text-sm">
                                    {movie.adult ? '18+' : 'PG-13'}
                                </span>
                                <span className="text-gray-400">2h 30m</span>
                                <span className="border border-gray-400 text-gray-400 px-1 text-sm">HD</span>
                            </div>
                            
                            <p className="text-gray-300 leading-relaxed mb-6">
                                {movie.overview}
                            </p>
                        </div>

                        {/* Sidebar */}
                        <div className="text-sm text-gray-400 space-y-4">
                            <div>
                                <span className="text-gray-500">Cast: </span>
                                <span>Action, Adventure, Sci-Fi</span>
                            </div>
                            
                            <div>
                                <span className="text-gray-500">Genres: </span>
                                <span>Action, Adventure, Sci-Fi</span>
                            </div>
                            
                            <div>
                                <span className="text-gray-500">This movie is: </span>
                                <span>Exciting, Suspenseful</span>
                            </div>
                        </div>
                    </div>

                    {/* More Like This Section */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">More Like This</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Placeholder for similar movies */}
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="bg-zinc-800 rounded-lg p-4">
                                    <div className="aspect-video bg-gray-700 rounded mb-3"></div>
                                    <div className="text-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-green-500">95% Match</span>
                                            <span className="text-gray-400">2023</span>
                                        </div>
                                        <p className="text-gray-300 text-xs">Similar movie description...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
} 