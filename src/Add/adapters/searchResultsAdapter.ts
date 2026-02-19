import { ResourceType } from 'hooks/useResource';

export type SearchResult = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  genre: string;
  date: string;
  rating: string;
};

export const searchAdapter: Record<ResourceType, (data: any) => SearchResult> = {
  libro: (book: any): SearchResult => ({
    id: book.id ,
    title: book.title || 'Sin título',
    artist: book.autor || '',
    cover: book.image || '',
    genre: book.genre?.[0] || '',
    date: book.releaseDate?.split('-')[0] || '',
    rating: book.rating ? `⭐ ${book.rating}` : '',
  }),

  pelicula: (film: any): SearchResult => ({
    id: film.id,
    title: film.title || 'Sin título',
    artist: film.director || '',
    cover: film.image || '',
    genre: film.genre?.[0] || '',
    date: film.releaseDate?.split('-')[0] || '',
    rating: film.rating ? `⭐ ${(film.rating/2).toFixed(1)}` : '',
  }),

  serie: (series: any): SearchResult => ({
    id: series.id,
    title: series.title || 'Sin título',
    artist: series.director || '',
    cover: series.image || '',
    genre: series.genre?.[0] || '',
    date: series.releaseDate?.split('-')[0]  || '',
    rating: series.rating ? `⭐ ${(series.rating/2).toFixed(1)}` : '',
  }),

  videojuego: (game: any): SearchResult => ({
    id: game.id,
    title: game.title,
    artist: game.autor || 'Desconocido',
    cover: game.image || '',
    genre: game.genre?.[0] || '',
    date: game.releaseDate?.split('-')[0] || '',
    rating: game.rating ? `⭐ ${(game.rating/20).toFixed(1)}` : '',
  }),

  cancion: (song: any): SearchResult => ({
    id: song.id,
    title: song.title || 'Sin título',
    artist: song.autor || 'Desconocido',
    cover: song.image || '',
    genre: song.genre || '',
    date: song.releaseDate?.split('-')[0] || '',
    rating: song.rating ? `⭐ ${song.rating.toFixed(1)}` : '',
  }),
};