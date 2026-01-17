export interface Film {
  id: number;
  title: string;
  image: string | null;
  releaseDate: string | null;
  description: string | null;
  rating: number | null;
  genreId: number[] | null;
}

export interface Book {
  id: number | null;
  title: string | null;
  autor: string | null;
  image: string | null;
  releaseDate: string | null;
  genre: string[] | null;
  reference: string | null;
  autorId: number | null;
  imageFull: string | null;
  description: string | null;
  rating: number | null;
}

export interface Series {
  id: number;
  title: string;
  image: string | null;
  releaseDate: string | null;
  genre: string[] | null;
  imageFull: string | null;
  description: string | null;
  rating: number | null;
  ended: string | null;
}

export interface Game {
  id: number;
  title: string;
  autor: string | null;
  image: string | null;
  releaseDate: string | null;
  genre: string[] | null;
  description: string | null;
  rating: number | null;
  platforms: string[] | null;
  gamemodes: string[] | null;
}

export interface Song {
  id: number;
  title: string | null;
  autor: string | null;
  image: string | null;
  releaseDate: string | null;
  genre: string | null;
  reference: string | null;
  autorId: number | null;
  imageFull: string | null;
  album: string | null;
}
