import { useState } from 'react';
import { router } from 'expo-router';
import { searchContentService } from '../services/searchContentService';
import { searchAdapter, SearchResult } from '../adapters/searchResultsAdapter';

export type CategoryKey = 'Libros' | 'Películas' | 'Series' | 'Videojuegos' | 'Canciones';

export const useSearchContent = () => {
  const [busqueda, setBusqueda] = useState('');
  const [recursoBusqueda, setRecursoBusqueda] = useState<CategoryKey>('Películas');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<SearchResult[]>([]);
  const [datosOriginales, setDatosOriginales] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!busqueda.trim()) return;
    setLoading(true);
    setMenuAbierto(false);

    try {
      const data = await searchContentService.fetchResources(busqueda, recursoBusqueda);
      setDatosOriginales(data);

      if (Array.isArray(data)) {
        const mapped = data.map(item => searchAdapter[recursoBusqueda](item));
        setResultados(mapped);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToDetails = (index: number) => {
    const typeMap = { Libros: 'book', Películas: 'film', Series: 'series', Videojuegos: 'game', Canciones: 'song' };
    const paramMap = { Libros: 'bookData', Películas: 'filmData', Series: 'seriesData', Videojuegos: 'gameData', Canciones: 'songData' };

    const type = typeMap[recursoBusqueda];
    const itemOriginal = datosOriginales[index];
    
    router.push({
      pathname: `/details/${type}/${type}Content`,
      params: { [paramMap[recursoBusqueda]]: JSON.stringify(itemOriginal) },
    });
  };

  return {
    busqueda, setBusqueda,
    recursoBusqueda, setRecursoBusqueda,
    menuAbierto, setMenuAbierto,
    loading, resultados,
    handleSearch, navigateToDetails,
    setResultados
  };
};