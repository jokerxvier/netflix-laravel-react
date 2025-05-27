import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const API_BASE = import.meta.env.VITE_TMDB_API_BASE;
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const SMALL_IMG_BASE_URL = "https://image.tmdb.org/t/p";
export const ORIGINAL_IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getMovieUrl(path: string) {
    return `${API_BASE}${path}?api_key=${API_KEY}`;
}

export function getImageUrl(path: string | null | undefined, size: string = 'w500') {
    if (!path) {
        return '/assets/netflix-logo.png'; // Fallback image
    }
    
    if (size === 'original') {
        return `${ORIGINAL_IMG_BASE_URL}${path}`;
    }
    
    return `${SMALL_IMG_BASE_URL}/${size}${path}`;
}
