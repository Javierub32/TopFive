import { ResourceType, StateType, useResource } from 'hooks/useResource';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';
import { useAuth } from 'context/AuthContext';

interface GroupDataPage {
  items: any[];
  nextPage?: number;
}

export const useGroupData = (category: ResourceType, state: StateType, targetUserId?: string ) => {
  const { user } = useAuth();
  const { fetchResources } = useResource();
  const queryClient = useQueryClient();

  const PAGE_SIZE = 9;

  const queryKeyId = targetUserId || user?.id;

  const {
    data: pagedData,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKeys.collectionGroup(queryKeyId, category, state),
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const ordenarPorUltimaActividad = state === 'COMPLETADO';

      const result = await fetchResources({
        type: category,
        estado: state,
        cantidad: PAGE_SIZE,
        ordenarPorFecha: true,
        from,
        to,
        ordenarPorUltimaActividad,
        targetUserId: queryKeyId
      });

      const items = result?.data || [];

      return {
        items,
        nextPage: items.length === PAGE_SIZE ? pageParam + 1 : undefined,
      };
    },
    enabled: !!queryKeyId && !!category && !!state,
    initialPageParam: 0,
    getNextPageParam: (lastPage: GroupDataPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    maxPages: 5,
  });

  const data = pagedData?.pages.flatMap((page: GroupDataPage) => page.items) ?? [];

  // Función para cargar la siguiente página
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const resetListDetails = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.collectionGroup(user?.id, category, state),
    });
    refetch();
  };

  return {
    loading: isLoading || isFetchingNextPage,
    data,
    handleLoadMore,
    resetListDetails,
  };
};
