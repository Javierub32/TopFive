import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from 'context/AuthContext';
import { queryKeys } from 'src/query/queryKeys';
import { diaryService } from '../services/diaryService';
import DiaryEntity from '../entity/diaryEntity';
import { ResourceType, useResource } from 'hooks/useResource';
import { router } from 'expo-router';

const PAGE_SIZE = 10;

interface DiaryPage {
  items: DiaryEntity[];
  nextPage?: number;
}

export const useDiary = (targetUserId?: string) => {
  const userId = targetUserId;
  const { fetchResources } = useResource();

  const query = useInfiniteQuery<DiaryPage>({
    queryKey: queryKeys.diary(userId),
    enabled: !!userId,
    initialPageParam: 0,

    queryFn: async ({ pageParam }) => {
      const items = await diaryService.getDiaryEntries(userId!, pageParam as number, PAGE_SIZE);

      return {
        items,
        nextPage: items.length === PAGE_SIZE ? (pageParam as number) + 1 : undefined,
      };
    },

    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);

  const loadMore = () => {
    if (query.hasNextPage && !query.isFetchingNextPage && !query.isFetching) {
      void query.fetchNextPage();
    }
  };

  const openReview = async (entry: DiaryEntity) => {
    const resourceType = entry.tipo_contenido.toLowerCase() as ResourceType;
    const routes: Record<ResourceType, string> = {
      pelicula: 'film',
      serie: 'series',
      videojuego: 'game',
      libro: 'book',
      cancion: 'song',
    };

    const type = routes[resourceType];
    if (!type) return;

    const result = await fetchResources({
      type: resourceType,
      recursoId: Number(entry.recurso_id),
      targetUserId: entry.usuarioId,
    });
    const resource = result.data?.[0];
    if (!resource) return;

    router.push({
      pathname: `/details/${type}/${type}Resource`,
      params: { item: JSON.stringify(resource), from: 'diary' },
    });
  };

  return {
    items,
    loadMore,
    loading: query.isLoading,
    loadingMore: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    refresh: query.refetch,
	refreshing: query.isRefetching && !query.isFetchingNextPage,
	openReview,
  };
};
