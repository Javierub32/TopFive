export interface Film {
  id: number;
  title: string;
  image: string | null;
  releaseDate: string | null;
  description: string | null;
  rating: number | null;
  genre: string[] | null;
  companies: string[] | null;
}

export interface Book {
  id: string | null;
  title: string | null;
  autor: string | null;
  image: string | null;
  releaseDate: string | null;
  genre: string[] | null;
  reference: string | null;
  autorId: string | null;
  imageFull: string | null;
  description: string | null;
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
  status: string | null;
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
  id: string | null;
  title: string | null;
  autor: string | null;
  image: string | null;
  releaseDate: string | null;
  genre: string | null;
  reference: string | null;
  autorId: string | null;
  imageFull: string | null;
  album: string | null;
}
