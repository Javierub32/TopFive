import { ResourceType } from 'hooks/useResource';

const BASE_URLS: Record<ResourceType, string> = {
  libro: 'https://javierub-topfive.hf.space/fetchBooks',
  pelicula: 'https://javierub-topfive.hf.space/fetchFilms',
  serie: 'https://javierub-topfive.hf.space/fetchSeries',
  videojuego: 'https://javierub-topfive.hf.space/fetchGames',
  cancion: 'https://javierub-topfive.hf.space/fetchSong',
};

export const searchContentService = {
  async fetchResources(termino: string, tipo: ResourceType) {
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