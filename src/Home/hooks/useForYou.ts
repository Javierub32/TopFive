import { useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from 'context/AuthContext';
import { router } from 'expo-router';
import { forYouService } from '../services/forYouService';
import { queryKeys } from '@/query/queryKeys';
import { Activity } from '../services/activityServices';
import { ResourceType, useResource } from 'hooks/useResource';

const PAGE_SIZE = 5;

const nuevaSemilla = () => Math.random() * 2 - 1; 

export const useForYou = () => {
  const { user } = useAuth();
  const { fetchResources } = useResource();
  const seedRef = useRef(nuevaSemilla());
  const offsetRef = useRef(0);

  const queryKey = queryKeys.forYou(user?.id);

  const { data, isLoading, isFetching, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey,
    queryFn: async () => {
      const items = await forYouService.fetchRandomReviews(
        user!.id,
        seedRef.current,
        PAGE_SIZE,
        offsetRef.current
      );

      if (items.length < PAGE_SIZE) {
        seedRef.current = nuevaSemilla();
        offsetRef.current = 0;
      } else {
        offsetRef.current += PAGE_SIZE;
      }

      return items;
    },
    enabled: !!user?.id,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.length > 0 ? allPages.length : undefined),
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
  });

  const reviews = useMemo<Activity[]>(() => data?.pages.flat() ?? [], [data]);

  const fetchMore = () => {
    if (!isFetching) fetchNextPage();
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
        resourceData.contenido = { ...resourceData.contenido, apiId: activity.idapi as any };
        (resourceData as any).username = activity.username;
        (resourceData as any).avatar_url = activity.avatar_url;
      }

      router.push({
        pathname: `/details/${type}/${type}Resource`,
        params: { item: JSON.stringify(resourceData), from: 'home' },
      });
    } catch (error) {
      console.error('Error navigating to for-you details:', error);
    }
  };

  return {
    reviews,
    loading: isLoading || isFetchingNextPage,
    fetchMore,
    handleItemPress,
  };
};