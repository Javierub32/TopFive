export type SearchResult = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  genre: string;
};

export const searchAdapter = {
  Libros: (book: any): SearchResult => ({
    id: book.id || `book-${Math.random()}`,
    title: book.title || 'Sin título',
    artist: book.autor || 'Desconocido',
    cover: book.image || '',
    genre: book.genre?.[0] || 'Literatura',
  }),

  Películas: (film: any): SearchResult => ({
    id: film.id,
    title: film.title || 'Sin título',
    artist: film.rating ? `⭐ ${film.rating.toFixed(1)}` : 'Desconocido',
    cover: film.image || '',
    genre: film.releaseDate ? film.releaseDate.split('-')[0] : 'Desconocido',
  }),

  Series: (series: any): SearchResult => ({
    id: series.id,
    title: series.title || 'Sin título',
    artist: series.rating ? `⭐ ${series.rating.toFixed(1)}` : 'Desconocido',
    cover: series.image || '',
    genre: series.genre?.[0] || 'TV',
  }),

  Videojuegos: (game: any): SearchResult => ({
    id: game.id,
    title: game.title,
    artist: game.autor || 'Desconocido',
    cover: game.image || '',
    genre: game.genre?.[0] || 'Gaming',
  }),

  Canciones: (song: any): SearchResult => ({
    id: song.id,
    title: song.title || 'Sin título',
    artist: song.autor || 'Desconocido',
    cover: song.image || '',
    genre: song.genre || 'Música',
  }),
};