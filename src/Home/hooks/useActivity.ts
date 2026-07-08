import { useMemo } from 'react';
import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { Activity, activityService } from '../services/activityServices';
import { useAuth } from 'context/AuthContext';
import { router } from 'expo-router';
import { ResourceType, useResource } from 'hooks/useResource';

export type { Activity } from '../services/activityServices';

interface ActivityPage {
  items: Activity[];
  nextPage?: number;
}

type ActivityFeedQueryKey = ['activity-feed', string | undefined];

export const useActivity = () => {
  const { user } = useAuth();
  const { fetchResources } = useResource();
  const pageSize = 5;

  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery<
      ActivityPage,
      Error,
      InfiniteData<ActivityPage, number>,
      ActivityFeedQueryKey,
      number
    >({
      queryKey: ['activity-feed', user?.id],
      queryFn: async ({ pageParam = 0 }: QueryFunctionContext<ActivityFeedQueryKey, number>) => {
        const from = pageParam * pageSize;
        const to = from + pageSize - 1;
        const activities = await activityService.getUltimosRecursosActivos(
          from,
          to,
          user?.id || ''
        );

        return {
          items: activities,
          nextPage: activities.length === pageSize ? pageParam + 1 : undefined,
        } satisfies ActivityPage;
      },
      enabled: !!user?.id,
      initialPageParam: 0,
      getNextPageParam: (lastPage: ActivityPage) => lastPage.nextPage,
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 30,
      maxPages: 5,
    });

  const activities = useMemo<Activity[]>(
    () => data?.pages.flatMap((page: ActivityPage) => page.items) ?? [],
    [data]
  );

  const fetchActivities = async () => {
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      await fetchNextPage();
    }
  };

  const refreshActivities = async () => {
    await refetch();
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

      router.push({
        pathname: `/details/${type}/${type}Resource`,
        params: { item: JSON.stringify(item?.data ? item.data[0] : null), from: 'home' },
      });
    } catch (error) {
      console.error('Error navigating to activity details:', error);
    }
  };

  return {
    activities,
    refreshing: isFetching && !isFetchingNextPage,
    loading: isLoading || isFetchingNextPage,
    fetchActivities,
    refreshActivities,
    handleItemPress,
  };
};
