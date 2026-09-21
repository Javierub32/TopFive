import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { searchContentService } from '../services/searchContentService';
import { searchAdapter, type SearchResult } from '../../Add/adapters/searchResultsAdapter';
import { ResourceType } from 'hooks/useResource';
import { useSearch } from 'context/SearchContext';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';
import { RecentContentSearch } from '@/Search/services/recentSearchStorage';
import { useRecentSearches } from '@/Search/hooks/useRecentSearches';
import { useAuth } from 'context/AuthContext';

export const useSearchContent = () => {
  const { user } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    setContentQuery: setBusqueda,
    contentQuery: busqueda,
    contentCategory: recursoBusqueda,
    setContentCategory,
    setContentResults: setResultados,
    contentResults: resultados,
    clearContentSearch,
  } = useSearch();

  const {
    recentSearches,
    loading: loadingRecentContent,
    addRecentSearch,
    deleteRecentSearch,
  } = useRecentSearches<RecentContentSearch>(recursoBusqueda, user?.id || null);

  const params = useLocalSearchParams<{ initialCategory?: string }>();
  const appliedInitialCategory = useRef<ResourceType | undefined>(undefined);
  const initialCategory =
    typeof params.initialCategory === 'string'
      ? (params.initialCategory as ResourceType)
      : undefined;

  // Aplicar la categoría inicial si viene en la URL
  useEffect(() => {
    if (!initialCategory) {
      appliedInitialCategory.current = undefined;
      return;
    }

    if (appliedInitialCategory.current === initialCategory) return;

    appliedInitialCategory.current = initialCategory;
    setContentCategory(initialCategory);
    clearContentSearch();
    setHasSearched(false);
  }, [clearContentSearch, initialCategory, setContentCategory]);

  useEffect(() => {
    if (!busqueda.trim() && resultados.length === 0) {
      setHasSearched(false);
    }
  }, [busqueda, resultados]);

  const handleSearch = async (categoria?: ResourceType) => {
    if (!busqueda.trim()) {
      setResultados([]);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    setLoading(true);
    setMenuAbierto(false);
    setResultados([]);
    const categoriaAUsar = categoria || recursoBusqueda;

    try {
      const searchTerm = busqueda.trim();
      const data = await queryClient.fetchQuery({
        queryKey: queryKeys.contentSearch(categoriaAUsar, searchTerm),
        queryFn: () => searchContentService.fetchContent(searchTerm, categoriaAUsar),
        staleTime: 1000 * 60 * 20,
        gcTime: 1000 * 60 * 60,
      });

      if (Array.isArray(data)) {
        const mapped = data.map((item) => searchAdapter[categoriaAUsar](item, t));
        setResultados(mapped);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToDetails = (id: string | number, category: ResourceType) => {
    const typeMap: Record<ResourceType, string> = {
      libro: 'book',
      pelicula: 'film',
      serie: 'series',
      videojuego: 'game',
      cancion: 'song',
    };

    const type = typeMap[category];

    router.push({
      pathname: `/details/${type}/${type}Content`,
      params: {
        id: String(id),
        from: 'search',
      },
    });
  };

  const openContent = async (item: SearchResult) => {
    await addRecentSearch({
      id: item.id,
      category: recursoBusqueda,
      term: busqueda.trim(),
      title: item.title,
      cover: item.cover,
      createdAt: Date.now(),
    });

    navigateToDetails(item.id, recursoBusqueda);
  };

  const openRecentContent = (item: RecentContentSearch) => {
    navigateToDetails(item.id, item.category);
  };

  const setRecursoBusqueda = async (categoria: ResourceType) => {
    setContentCategory(categoria);
    await handleSearch(categoria);
  };

  return {
    busqueda,
    setBusqueda,
    recursoBusqueda,
    setRecursoBusqueda,
    menuAbierto,
    setMenuAbierto,
    hasSearched,
    loading,
    resultados,
    handleSearch,
    openContent,
    openRecentContent,
    recentSearches,
    loadingRecentContent,
    deleteRecentSearch,
    setResultados,
  };
};
