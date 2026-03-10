import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { searchContentService } from '../services/searchContentService';
import { searchAdapter, SearchResult } from '../../Add/adapters/searchResultsAdapter';
import { ResourceType } from 'hooks/useResource';
import { useSearch } from 'context/SearchContext';

export const useSearchContent = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
	setContentQuery: setBusqueda,
	contentQuery: busqueda,
	contentCategory: recursoBusqueda,
	setContentCategory,
	setContentResults: setResultados,
	contentResults: resultados,
	clearContentSearch,
  } = useSearch();

  const params = useLocalSearchParams<{ initialCategory?: string }>();

    // Aplicar la categoría inicial si viene en la URL
  useEffect(() => {
	if (params.initialCategory && params.initialCategory !== recursoBusqueda) {
	  setContentCategory(params.initialCategory as ResourceType);
	  clearContentSearch();
	}
  }, [params.initialCategory]);


  const handleSearch = async (categoria?: ResourceType) => {
    if (!busqueda.trim()) {
		setResultados([]);
		return;
	}
    setLoading(true);
    setMenuAbierto(false);

    const categoriaAUsar = categoria || recursoBusqueda;

    try {
      const data = await searchContentService.fetchContent(busqueda, categoriaAUsar);

      if (Array.isArray(data)) {
        const mapped = data.map(item => searchAdapter[categoriaAUsar](item));
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

    const type = typeMap[recursoBusqueda];
    
    router.push({
      pathname: `/details/${type}/${type}Content`,
      params: { id: resultados[index].id, from: 'search' },
    });
  };

  const setRecursoBusqueda = async (categoria: ResourceType)  =>  {
	setContentCategory(categoria);
	await handleSearch(categoria);
  }

  return {
    busqueda, setBusqueda,
    recursoBusqueda, setRecursoBusqueda,
    menuAbierto, setMenuAbierto,
    loading, resultados,
    handleSearch, navigateToDetails,
    setResultados
  };
};


