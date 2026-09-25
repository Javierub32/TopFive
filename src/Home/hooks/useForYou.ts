import { useMemo, useState } from 'react';
import { useInfiniteQuery, useQueryClient, InfiniteData, QueryFunctionContext } from '@tanstack/react-query';
import { forYouService } from '../services/forYouService';
import { Activity } from '../services/activityServices';
import { useAuth } from 'context/AuthContext';
import { router } from 'expo-router';
import { ResourceType, useResource } from 'hooks/useResource';

const BATCH_SIZE = 9;

interface ForYouPage {
  items: Activity[];
  nextPage?: number;
}

type ForYouFeedQueryKey = ['forYouFeed', string | undefined, number];

export const useForYou = () => {
  const { user } = useAuth();
  const { fetchResources } = useResource();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [seed, setSeed] = useState<number>(() => Math.random());

  const queryKey: ForYouFeedQueryKey = ['forYouFeed', user?.id, seed];

  const fetchForYouPage = async (pageParam: number) => {
    const offset = pageParam * BATCH_SIZE;

    const activities = await forYouService.fetchRandomactivities(
      user?.id || '',
      seed,
      BATCH_SIZE,
      offset
    );

    return {
      items: activities,
      nextPage: activities.length === BATCH_SIZE ? pageParam + 1 : undefined,
    } satisfies ForYouPage;
  };

  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery<
      ForYouPage,
      Error,
      InfiniteData<ForYouPage, number>,
      ForYouFeedQueryKey,
      number
    >({
      queryKey,
      queryFn: async ({ pageParam = 0 }: QueryFunctionContext<ForYouFeedQueryKey, number>) => {
        return fetchForYouPage(pageParam);
      },
      enabled: !!user?.id,
      initialPageParam: 0,
      getNextPageParam: (lastPage: ForYouPage) => lastPage.nextPage,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    });

  const activities = useMemo<Activity[]>(
    () => data?.pages.flatMap((page: ForYouPage) => page.items) ?? [],
    [data]
  );

  const handleLoadMore = async () => {
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      await fetchNextPage();
    }
  };

  const refreshForYou = async () => {
    if (!user?.id) return;

    setIsRefreshing(true);

    try {
      setSeed(Math.random()); // Cuando refrescamos, generamos una nueva semilla aleatoria

      const firstPage = await fetchForYouPage(0);

      queryClient.setQueryData<InfiniteData<ForYouPage, number>>(queryKey, {
        pages: [firstPage],
        pageParams: [0],
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleItemPress = async (activity: Activity) => {
    try {
      const resourceType = activity.tipo_contenido.toLowerCase() as ResourceType;
      const resourceTypeMap: Record<ResourceType, string> = {
        pelicula: 'film',
        serie: 'series',
        videojuego: 'game',
        libro: 'book',
        cancion: 'song',
      };

      const type = resourceTypeMap[resourceType];
      if (!type) return;

      const item = await fetchResources({
        type: resourceType,
        recursoId: activity.recurso_id ? parseInt(activity.recurso_id, 10) : null,
        targetUserId: activity.usuarioId,
      });

      const resourceData = item?.data ? item.data[0] : null;

      if (resourceData && activity.idapi != null) {
        resourceData.contenido = {
          ...resourceData.contenido,
          apiId: activity.idapi as any,
        };

        (resourceData as any).username = activity.username;
        (resourceData as any).avatar_url = activity.avatar_url;
      }

      router.push({
        pathname: `/details/${type}/${type}Resource`,
        params: { item: JSON.stringify(resourceData), from: 'home' },
      });
    } catch (error) {
      console.error('Error navigating to activity details:', error);
    }
  };

  return {
    activities,
    refreshing: isRefreshing || (isFetching && !isFetchingNextPage),
    loading: isLoading || isFetchingNextPage,
    handleLoadMore,
    refreshForYou,
    handleItemPress,
  };
};