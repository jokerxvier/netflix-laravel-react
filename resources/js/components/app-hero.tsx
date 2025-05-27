import { useState } from "react";
import { type Movie} from "@/types";
import { Link } from "@inertiajs/react";
import { Play, Info, X } from "lucide-react";
import { API_KEY } from "@/stores/movie-store";
import { getImageUrl } from "@/lib/utils";

export const SMALL_IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const ORIGINAL_IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

interface AppHeroProps {
    movie: Movie;
    onMoreInfoClick?: (movie: Movie) => void;
}

export function AppHero({ movie, onMoreInfoClick }: AppHeroProps) {
    const [imgLoading, setImgLoading] = useState(true);
    const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
    
    const fetchTrailer = async (movieId: number) => {
        setIsLoadingTrailer(true);
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
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
    
    return (
        <>
            <div className="z-10">
                {isPlayingTrailer && trailerKey ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
                        title={movie?.title || movie?.name}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <img
                        src={getImageUrl(movie?.backdrop_path, 'original')}
                        alt={movie?.title || movie?.name || "Hero image"}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        onLoad={() => {
                            setImgLoading(false);
                        }}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/netflix-logo.png';
                            setImgLoading(false);
                        }}
                    />
                )}

                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32">
					<div className="bg-gradient-to-b from-black via-transparent to-transparent  absolute w-full h-full top-0 left-0 -z-10" />

                        <div className="max-w-2xl">
                            <h1 className="mt-4 text-6xl font-extrabold text-balance">
                                {movie?.title || movie?.name}
                            </h1>
                            <p className="mt-2 text-lg">
                                {movie?.release_date?.split("-")[0] ||
                                    movie?.first_air_date.split("-")[0]}{" "}
                                | {movie?.adult ? "18+" : "PG-13"}
                            </p>

                            <p className="mt-4 text-lg">
                                {movie?.overview.length > 200
                                    ? movie?.overview.slice(0, 200) + "..."
                                    : movie?.overview}
                            </p>
                        </div>

                        <div className="flex items-center mt-8">
                            {isPlayingTrailer ? (
                                <button
                                    onClick={handleStopTrailer}
                                    className="bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded mr-4 flex items-center"
                                >
                                    <X className="size-6 mr-2" />
                                    Stop
                                </button>
                            ) : (
                                <button
                                    onClick={handlePlayTrailer}
                                    disabled={isLoadingTrailer}
                                    className="bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded mr-4 flex items-center disabled:opacity-50"
                                >
                                    <Play className="size-6 mr-2 fill-black" />
                                    {isLoadingTrailer ? 'Loading...' : 'Play Trailer'}
                                </button>
                            )}

                            {onMoreInfoClick ? (
                                <button
                                    onClick={() => onMoreInfoClick(movie)}
                                    className="bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded flex items-center"
                                >
                                    <Info className="size-6 mr-2" />
                                    More Info
                                </button>
                            ) : (
                                <Link
                                    href={`/watch/${movie?.id}`}
                                    className="bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded flex items-center"
                                >
                                    <Info className="size-6 mr-2" />
                                    More Info
                                </Link>
                            )}
                        </div>
				</div>
            </div>
        </>
    );
}