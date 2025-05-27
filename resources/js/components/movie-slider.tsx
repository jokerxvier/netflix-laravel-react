import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Movie } from "@/types";
import { getImageUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieSliderProps {
    category: string;
    movies: Movie[];
    onMovieClick: (movie: Movie) => void;
}

function MovieCard({ movie, onMovieClick }: { movie: Movie; onMovieClick: (movie: Movie) => void }) {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    return (
        <div 
            className="min-w-[250px] relative group mb-5 cursor-pointer" 
            onClick={() => onMovieClick(movie)}
        >
            <div className="rounded-lg overflow-hidden bg-gray-800 relative">
                {imageLoading && (
                    <Skeleton className="absolute inset-0 w-full h-[140px] bg-gray-700" />
                )}
                <img
                    src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w500')}
                    alt={movie.title || movie.name || "Movie image"}
                    className={`w-full h-[140px] object-cover transition-transform duration-300 ease-in-out group-hover:scale-125 ${
                        imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setImageLoading(false)}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/netflix-logo.png';
                        setImageLoading(false);
                        setImageError(true);
                    }}
                    loading="lazy"
                />
            </div>
            <p className="mt-2 text-center text-sm">{movie.title || movie.name}</p>
        </div>
    );
}

export function MovieSlider({ category, movies, onMovieClick }: MovieSliderProps) {
	const [showArrows, setShowArrows] = useState(false);
	const sliderRef = useRef<HTMLDivElement | null>(null);
	const formattedCategoryName  = category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);

	const scrollLeft = () => {
		if (sliderRef.current) {
			sliderRef.current?.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
		}
	};
	
	const scrollRight = () => {
		sliderRef.current?.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
	};

	return (
		<div
			className="bg-black text-white relative px-5 md:px-20"
			onMouseEnter={() => setShowArrows(true)}
			onMouseLeave={() => setShowArrows(false)}
		>
			<h2 className="mb-4 text-2xl font-bold">
				{formattedCategoryName} 
			</h2>

			<div className="flex space-x-4 overflow-x-hidden scrollbar-hide" ref={sliderRef}>
				{movies.map((item) => (
					<MovieCard 
						key={item.id}
						movie={item}
						onMovieClick={onMovieClick}
					/>
				))}
			</div>

			{showArrows && (
				<>
					<button
						className="absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
						onClick={scrollLeft}
					>
						<ChevronLeft size={24} />
					</button>

					<button
						className="absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
						onClick={scrollRight}
					>
						<ChevronRight size={24} />
					</button>
				</>
			)}
		</div>
	);
}

