import { useCallback, useEffect, useMemo } from 'react';
import { userSearchService } from '../services/userSearchServices';
import { userService } from '@/User/services/userService';
import { useAuth } from 'context/AuthContext';
import { Keyboard } from 'react-native';
import { useSearch } from 'context/SearchContext';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { queryKeys } from '@/query/queryKeys';
import { useRecentSearches } from './useRecentSearches';
import { RecentUserSearch } from '../services/recentSearchStorage';

interface UserSearchPage {
  items: any[];
  nextPage?: number;
}

export const useSearchUser = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    setUserQuery: setBusqueda,
    userQuery: busqueda,
    userResults: resultados,
    setUserResults: setResultados,
    activeUserSearch: activeSearch,
    setActiveUserSearch: setActiveSearch,
	clearUserSearch
  } = useSearch();

  const { recentSearches, loading: loadingRecentUsers, addRecentSearch, deleteRecentSearch } 
  	= useRecentSearches<RecentUserSearch>('user', user?.id || null);

  const PAGE_SIZE = 9;

  const {
    data: blockedUserIds,
    isLoading: loadingBlockedUsers,
    refetch: refetchBlockedUsers,
  } = useQuery({
    queryKey: queryKeys.blockedUserIds(user?.id),
    queryFn: () => userService.getBlockedUserIds(user!.id),
    enabled: !!user?.id,
    staleTime: 0,
  });

  useFocusEffect(
    useCallback(() => {
      if (user?.id) void refetchBlockedUsers();
    }, [refetchBlockedUsers, user?.id])
  );

  const blockedUserIdSet = useMemo(() => new Set(blockedUserIds ?? []), [blockedUserIds]);
  const hasLoadedBlockedUsers = !user?.id || blockedUserIds !== undefined;

  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: queryKeys.userSearch(user?.id, activeSearch),
      queryFn: async ({ pageParam = 0 }) => {
        const from = pageParam * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const currentBlockedUserIds = user?.id
          ? await queryClient.fetchQuery({
              queryKey: queryKeys.blockedUserIds(user.id),
              queryFn: () => userService.getBlockedUserIds(user.id),
              staleTime: 0,
            })
          : [];
        const users = await userSearchService.fetchUsers(
          activeSearch,
          user?.id,
          from,
          to,
          currentBlockedUserIds
        );

        return {
          items: users,
          nextPage: users.length === PAGE_SIZE ? pageParam + 1 : undefined,
        };
      },
      enabled: !!activeSearch.trim() && hasLoadedBlockedUsers,
      initialPageParam: 0,
      getNextPageParam: (lastPage: UserSearchPage) => lastPage.nextPage,
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
      maxPages: 5,
    });

  useEffect(() => {
    if (!hasLoadedBlockedUsers) {
      setResultados([]);
      return;
    }

    const users = data?.pages.flatMap((page: UserSearchPage) => page.items) ?? [];
    setResultados(users.filter((item) => !blockedUserIdSet.has(item.id)));
  }, [data, blockedUserIdSet, hasLoadedBlockedUsers, setResultados]);

  const visibleResults = hasLoadedBlockedUsers
    ? resultados.filter((item) => !blockedUserIdSet.has(item.id))
    : [];
  const visibleRecentSearches = hasLoadedBlockedUsers
    ? recentSearches.filter((item) => !blockedUserIdSet.has(item.id))
    : [];

  // Se ejecuta SOLO al dar Enter o pulsar la lupa
	const handleSearch = () => {
		const term = busqueda.trim();
		Keyboard.dismiss();

		if (!term) {
			clearUserSearch();
			return;
		}

		if (term === activeSearch) {
			refetch();
			return;
		}

		setActiveSearch(term);
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
    resultados: visibleResults,
    handleLoadMore,
	loading: isFetching || isFetchingNextPage,
    handleSearch,
	activeSearch,


	recentSearches: visibleRecentSearches,
	addRecentSearch,
	deleteRecentSearch,
	loadingRecentUsers: loadingRecentUsers || loadingBlockedUsers
  };
};
