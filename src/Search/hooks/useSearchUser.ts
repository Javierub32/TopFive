import { useEffect } from 'react';
import { userSearchService } from '../services/userSearchServices';
import { useAuth } from 'context/AuthContext';
import { Keyboard } from 'react-native';
import { useSearch } from 'context/SearchContext';
import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

interface UserSearchPage {
  items: any[];
  nextPage?: number;
}

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

  const PAGE_SIZE = 9;

  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: queryKeys.userSearch(user?.id, activeSearch),
      queryFn: async ({ pageParam = 0 }) => {
        const from = pageParam * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const users = await userSearchService.fetchUsers(activeSearch, user?.id, from, to);

        return {
          items: users,
          nextPage: users.length === PAGE_SIZE ? pageParam + 1 : undefined,
        };
      },
      enabled: !!activeSearch.trim(),
      initialPageParam: 0,
      getNextPageParam: (lastPage: UserSearchPage) => lastPage.nextPage,
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
      maxPages: 5,
    });

  useEffect(() => {
    setResultados(data?.pages.flatMap((page: UserSearchPage) => page.items) ?? []);
  }, [data, setResultados]);

  // Se ejecuta SOLO al dar Enter o pulsar la lupa
  const handleSearch = () => {
    const term = busqueda.trim();
    if (term) {
      Keyboard.dismiss(); // Ocultar teclado
      setActiveSearch(term); // Guardamos el término activo
      if (term === activeSearch) {
        refetch();
      }
    }
  };

  // Se ejecuta al bajar en la lista
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  return {
    busqueda,
    setBusqueda,
    resultados,
    handleLoadMore,
    loading: isFetching || isFetchingNextPage,
    handleSearch,
  };
};
