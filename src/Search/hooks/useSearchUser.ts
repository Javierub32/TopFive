import { useState } from 'react';
import { userSearchService } from '../services/userSearchServices';
import { useAuth } from 'context/AuthContext';
import { Keyboard } from 'react-native';
import { useSearch } from 'context/SearchContext';

export const useSearchUser = () => {
  const { user } = useAuth();
  
  const {
	setUserQuery: setBusqueda,
	userQuery: busqueda,
	userResults: resultados,
	setUserResults: setResultados,
	activeUserSearch: activeSearch,
	setActiveUserSearch: setActiveSearch,
  } = useSearch();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 9; 

  const fetchUsersData = async (pageNum: number, searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      const users = await userSearchService.fetchUsers(searchTerm, user?.id, from, to);

      if (pageNum === 0) {
        setResultados(users);
      } else {
        setResultados([...resultados, ...users]);
      }

      // Si recibimos menos usuarios que el tamaño de página, no hay más datos
      if (users.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta SOLO al dar Enter o pulsar la lupa
  const handleSearch = () => {
    const term = busqueda.trim();
    if (term) {
      Keyboard.dismiss(); // Ocultar teclado
      setPage(0);
      setHasMore(true);
      setActiveSearch(term); // Guardamos el término activo
      fetchUsersData(0, term);
    }
  };

  // Se ejecuta al bajar en la lista
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsersData(nextPage, activeSearch);
    }
  };

  return {
    busqueda,
    setBusqueda,
    resultados,
    handleLoadMore,
    loading,
    handleSearch,
  };
};