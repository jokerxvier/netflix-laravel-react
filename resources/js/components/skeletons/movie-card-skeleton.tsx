import { Skeleton } from '@/components/ui/skeleton';

export function MovieCardSkeleton() {
    return (
        <div className="min-w-[250px] relative mb-5">
            <div className="rounded-lg overflow-hidden bg-gray-800">
                <Skeleton className="w-full h-[140px] bg-gray-700" />
            </div>
            <Skeleton className="mt-2 h-4 w-3/4 mx-auto bg-gray-700" />
        </div>
    );
} 