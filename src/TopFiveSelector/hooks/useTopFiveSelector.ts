import { topFiveService } from '@/Profile/services/topFiveServices';
import { queryKeys } from '@/query/queryKeys';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'context/AuthContext';
import { ResourceMap, ResourceType, useResource } from 'hooks/useResource';

type TopFiveSelectorResource = ResourceMap[ResourceType];

interface TopFiveSelectorPage {
  items: TopFiveSelectorResource[];
  nextPage?: number;
}

export const useTopFiveSelector = (category?: ResourceType) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { fetchResources } = useResource();

  const PAGE_SIZE = 9; // Cantidad de elementos a cargar por página

  const {
    data: pagedData,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.topFiveSelector(user?.id, category),
    queryFn: async ({ pageParam = 0 }) => {
      if (!category) {
        return { items: [] as TopFiveSelectorResource[], nextPage: undefined };
      }

      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const result = await fetchResources({
        type: category,
        from,
        to,
      });
      const newItems = result?.data || [];

      return {
        items: newItems as TopFiveSelectorResource[],
        nextPage: newItems.length === PAGE_SIZE ? pageParam + 1 : undefined,
      };
    },
    enabled: !!user?.id && !!category,
    initialPageParam: 0,
    getNextPageParam: (lastPage: TopFiveSelectorPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    maxPages: 5,
  });

  const fetchTopFiveSelector = async () => {
    if (!user || isFetchingNextPage || isFetching) return;
    if (hasNextPage) await fetchNextPage();
  };

  const resetTopFiveSelector = () => {
    queryClient.invalidateQueries({ queryKey: ['topFive', 'selector', user?.id] });
  };

  const insertTopFiveMutation = useMutation({
    mutationFn: ({
      posicion,
      tipoRecurso,
      recursoId,
    }: {
      posicion: number;
      tipoRecurso: ResourceType;
      recursoId: number;
    }) => topFiveService.insertToTopFive(user.id, posicion, tipoRecurso, recursoId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.topFive(user?.id) });
    },
  });

  const insertToTopFive = async (
    posicion: number,
    tipoRecurso: ResourceType,
    recursoId: number
  ) => {
    try {
      await insertTopFiveMutation.mutateAsync({ posicion, tipoRecurso, recursoId });
    } catch (error) {
      console.error('Error al insertar en Top Five:', error);
    }
  };

  return {
    data: pagedData?.pages.flatMap((page: TopFiveSelectorPage) => page.items) ?? [],
    loading: isLoading || isFetchingNextPage || insertTopFiveMutation.isPending,
    hasMore: !!hasNextPage,
    fetchTopFiveSelector,
    resetTopFiveSelector,
    insertToTopFive,
  };
};
