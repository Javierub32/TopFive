import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { searchContentService } from '../services/searchContentService';
import { searchAdapter, SearchResult } from '../../Add/adapters/searchResultsAdapter';
import { ResourceType } from 'hooks/useResource';

export const useSearchContent = () => {
  const [busqueda, setBusqueda] = useState('');
  const [recursoBusqueda, setRecursoBusqueda] = useState<ResourceType>('pelicula');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<SearchResult[]>([]);
  const [datosOriginales, setDatosOriginales] = useState<any[]>([]);

  const params = useLocalSearchParams<{ initialCategory?: string }>();

    // Aplicar la categoría inicial si viene en la URL
  useEffect(() => {
	if (params.initialCategory && params.initialCategory !== recursoBusqueda) {
	  setRecursoBusqueda(params.initialCategory as ResourceType);
	  setResultados([]);
	}
  }, [params.initialCategory]);


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
    const typeMap: Record<ResourceType, string> = { 
      libro: 'book', 
      pelicula: 'film', 
      serie: 'series', 
      videojuego: 'game', 
      cancion: 'song' 
    };
    const paramMap: Record<ResourceType, string> = { 
      libro: 'bookData', 
      pelicula: 'filmData', 
      serie: 'seriesData', 
      videojuego: 'gameData', 
      cancion: 'songData' 
    };

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


