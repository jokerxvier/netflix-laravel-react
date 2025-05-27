import { Skeleton } from '@/components/ui/skeleton';
import { MovieCardSkeleton } from './movie-card-skeleton';

export function MovieSliderSkeleton() {
    return (
        <div className="bg-black text-white relative px-5 md:px-20">
            {/* Title skeleton */}
            <Skeleton className="mb-4 h-8 w-64 bg-gray-700" />

            {/* Movie cards skeleton */}
            <div className="flex space-x-4 overflow-x-hidden scrollbar-hide">
                {Array.from({ length: 6 }).map((_, index) => (
                    <MovieCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
} 