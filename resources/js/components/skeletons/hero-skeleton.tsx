import { Skeleton } from '@/components/ui/skeleton';

export function HeroSkeleton() {
    return (
        <div className="relative h-screen text-white">
            {/* Background skeleton */}
            <Skeleton className="absolute top-0 left-0 w-full h-full bg-gray-800" />
            
            {/* Content overlay */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32">
                <div className="bg-gradient-to-b from-black via-transparent to-transparent absolute w-full h-full top-0 left-0 -z-10" />
                
                <div className="max-w-2xl">
                    {/* Title skeleton */}
                    <Skeleton className="h-16 w-3/4 mb-4 bg-gray-700" />
                    
                    {/* Subtitle skeleton */}
                    <Skeleton className="h-6 w-1/3 mb-4 bg-gray-700" />
                    
                    {/* Description skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-full bg-gray-700" />
                        <Skeleton className="h-5 w-full bg-gray-700" />
                        <Skeleton className="h-5 w-2/3 bg-gray-700" />
                    </div>
                </div>

                {/* Buttons skeleton */}
                <div className="flex items-center mt-8 gap-4">
                    <Skeleton className="h-12 w-32 bg-gray-700" />
                    <Skeleton className="h-12 w-32 bg-gray-700" />
                </div>
            </div>
        </div>
    );
} 