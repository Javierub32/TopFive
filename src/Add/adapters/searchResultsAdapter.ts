import { ResourceType } from 'hooks/useResource';
import { TFunction } from 'i18next';

export type SearchResult = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  genre: string;
  date: string;
  rating: string;
};

export const searchAdapter: Record<ResourceType, (data: any, t: TFunction) => SearchResult> = {
  libro: (book: any, t: TFunction): SearchResult => ({
    id: book.id ,
    title: book.title || t('common.noTitle'),
    artist: book.autor || t('common.unknown'),
    cover: book.image || '',
    genre: book.genre?.[0] || '',
    date: book.releaseDate?.split('-')[0] || '',
    rating: book.rating || '',
  }),

  pelicula: (film: any, t: TFunction): SearchResult => ({
    id: film.id,
    title: film.title || t('common.noTitle'),
    artist: film.director || t('common.unknown'),
    cover: film.image || '',
    genre: film.genre?.[0] || '',
    date: film.releaseDate?.split('-')[0] || '',
    rating: film.rating || '',
  }),

  serie: (series: any, t: TFunction): SearchResult => ({
    id: series.id,
    title: series.title || t('common.noTitle'),
    artist: series.director || t('common.unknown'),
    cover: series.image || '',
    genre: series.genre?.[0] || '',
    date: series.releaseDate?.split('-')[0]  || '',
    rating: series.rating || '',
  }),

  videojuego: (game: any, t: TFunction): SearchResult => ({
    id: game.id,
    title: game.title || t('common.noTitle'),
    artist: game.autor || t('common.unknown'),
    cover: game.image || '',
    genre: game.genre?.[0] || '',
    date: game.releaseDate?.split('-')[0] || '',
    rating: game.rating || '',
  }),

  cancion: (song: any, t: TFunction): SearchResult => ({
    id: song.id,
    title: song.title || t('common.noTitle'),
    artist: song.autor || t('common.unknown'),
    cover: song.image || '',
    genre: song.genre || '',
    date: song.releaseDate?.split('-')[0] || '',
    rating: song.rating || '',
  }),
};