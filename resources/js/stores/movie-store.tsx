import { create } from 'zustand';

export const API_KEY = 'a8bd04e1711338362bc753aded515929';
const API_URL = 'https://api.themoviedb.org/3';

export const SMALL_IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const ORIGINAL_IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

export const MOVIE_CATEGORIES = ["now_playing", "top_rated", "popular", "upcoming"];
export const TV_CATEGORIES = ["airing_today", "on_the_air", "popular", "top_rated"];

export type Movie = {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
};
  
type MovieStore = {
    movies: Movie[];
    loading: boolean;
    type: string;
    fetchTrendingMovies: () => Promise<void>;
    fetchMoviesByCategory: (category: string) => Promise<void>;
};

export const useMovieStore = create<MovieStore>((set) => ({
    movies: [],
    loading: false,
    type: 'trending',
  
    fetchTrendingMovies: async () => {
      set({ loading: true, type: 'trending' });
  
      try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
        const data = await res.json();
        set({ movies: data.results || [] });
      } catch (err) {
        console.error('Trending fetch failed:', err);
        set({ movies: [] });
      } finally {
        set({ loading: false });
      }
    },
  
    fetchMoviesByCategory: async (category: string) => {
      set({ loading: true, type: category });
  
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}`);
        const data = await res.json();
        set({ movies: data.results || [] });
      } catch (err) {
        console.error('Category fetch failed:', err);
        set({ movies: [] });
      } finally {
        set({ loading: false });
      }
    },
}));