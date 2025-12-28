const BASE_URLS: Record<string, string> = {
  Libros: 'https://javierub-topfive.hf.space/fetchBooks',
  Películas: 'https://javierub-topfive.hf.space/fetchFilms',
  Series: 'https://javierub-topfive.hf.space/fetchSeries',
  Videojuegos: 'https://javierub-topfive.hf.space/fetchGames',
  Canciones: 'https://javierub-topfive.hf.space/fetchSong',
};

export const searchContentService = {
  async fetchResources(termino: string, tipo: string) {
    const apiUrl = BASE_URLS[tipo];
    if (!apiUrl) throw new Error(`No API for ${tipo}`);

    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    const url = `${apiUrl}?term=${encodeURIComponent(termino)}`;

    const response = await fetch(url, {
      headers: { 'X-API-Key': apiKey || '' },
    });

    if (!response.ok) throw new Error('Error en la red');
    return await response.json();
  }
};