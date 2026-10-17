import { notificationServices } from '../services/notificationServices';
import { useAuth } from 'context/AuthContext';
import { supabase } from 'lib/supabase';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef } from 'react';
import { ResourceType } from 'hooks/useResource';
import { AppNotification, ResourceNotification } from '../types/notification';

interface NotificationsPage {
  items: AppNotification[];
  nextPage?: number;
}

const RESOURCE_ROUTES: Record<ResourceType, string> = {
  pelicula: 'film',
  serie: 'series',
  videojuego: 'game',
  libro: 'book',
  cancion: 'song',
};

export const useNotificationList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const pageSize = 10;

  const enrichNotifications = async (data: any[]) => {
    if (!user?.id || data.length === 0) return data;

    /* Solo hacen falta los seguidos que aparecen en esta página: sin el .in() esto bajaba
       la lista completa de seguidos, y además una vez por página. */
    const followerIds = Array.from(new Set(data.map((n) => n.follower_id)));

    const { data: myFollows } = await supabase
      .from('relationships')
      .select('following_id, status')
      .eq('follower_id', user.id)
      .in('following_id', followerIds);

    const followMap = new Map(myFollows?.map((f) => [f.following_id, f.status]));

    return data.map((n) => ({
      ...n,
      myFollowStatus: followMap.get(n.follower_id) || 'none',
    }));
  };

  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: queryKeys.notifications(user?.id),
      queryFn: async ({ pageParam = 0 }) => {
        const from = pageParam * pageSize;
        const to = from + pageSize - 1;

        /* Cada tabla se pagina por separado y las dos se mezclan por fecha al leerlas. */
        const [social, resource] = await Promise.all([
          notificationServices.fetchNotifications(user!.id, from, to),
          notificationServices.fetchResourceNotifications(user!.id, from, to),
        ]);

        const enriched = await enrichNotifications(social);

        const items: AppNotification[] = [
          ...enriched.map((n: any) => ({
            ...n,
            kind: 'social' as const,
            key: `social-${n.id}`,
            date: n.created_at,
          })),
          ...resource.items.map((n) => ({
            ...n,
            kind: 'resource' as const,
            key: `resource-${n.id}`,
          })),
        ];

        const hasMore = social.length === pageSize || resource.rawCount === pageSize;

        return { items, nextPage: hasMore ? pageParam + 1 : undefined };
      },
      enabled: !!user?.id,
      initialPageParam: 0,
      getNextPageParam: (lastPage: NotificationsPage) => lastPage.nextPage,
      staleTime: 0,
      refetchOnMount: 'always',
      gcTime: 1000 * 60 * 30,
      /* Sin maxPages: descarta la primera página al pasar del límite y, como la lista se
         ordena por fecha, lo que desaparecería es lo más reciente. Recuperarla exigiría un
         getPreviousPageParam que no tiene sentido aquí. */
    });

  const notifications = useMemo(
    () =>
      (data?.pages.flatMap((page: NotificationsPage) => page.items) ?? [])
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [data]
  );

  /* refetchOnMount ya se encarga del montaje, así que el primer foco no debe refetchear:
     si no, cada apertura de la pantalla pide la página 0 dos veces. */
  const hasFocusedOnce = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;

      if (hasFocusedOnce.current) {
        refetch();
      }
      hasFocusedOnce.current = true;

      /* Abrir la pantalla cuenta como haberlas visto. El update es idempotente, así que no
         pasa nada por lanzarlo en cada visita; solo hay que refrescar el badge después. */
      notificationServices
        .markResourceNotificationsRead(user.id)
        .then(() =>
          queryClient.invalidateQueries({ queryKey: queryKeys.notificationCount(user.id) })
        )
        .catch((error) => console.error('Error marking notifications as read:', error));
    }, [refetch, user?.id, queryClient])
  );

  const fetchNotifications = async () => {
    /* Solo isFetchingNextPage: con !isFetching cualquier refetch en vuelo descartaba la
       petición, y onEndReached no se reemite hasta que cambia el alto del contenido. */
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  const refreshNotifications = async () => {
    if (!user?.id) return;
    await refetch();
  };

  const invalidateNotificationData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications(user?.id) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationCount(user?.id) }),
      queryClient.invalidateQueries({ queryKey: ['followers'] }),
      queryClient.invalidateQueries({ queryKey: ['following'] }),
      queryClient.invalidateQueries({ queryKey: ['profile'] }),
      queryClient.invalidateQueries({ queryKey: queryKeys.publicProfilePrefix() }),
    ]);
  };

  const acceptMutation = useMutation({
    mutationFn: ({ follower_id, following_id }: { follower_id: string; following_id: string }) =>
      notificationServices.acceptNotification(follower_id, following_id),
    onSuccess: invalidateNotificationData,
  });

  const declineMutation = useMutation({
    mutationFn: ({ follower_id, following_id }: { follower_id: string; following_id: string }) =>
      notificationServices.declineNotification(follower_id, following_id),
    onSuccess: invalidateNotificationData,
  });

  const handleAcceptNotification = async (
    notificationId: string,
    follower_id: string,
    following_id: string
  ) => {
    try {
      await acceptMutation.mutateAsync({ follower_id, following_id });
    } catch (error) {
      console.error('Error accepting notification:', error);
    }
  };

  const handleDeclineNotification = async (
    notificationId: string,
    follower_id: string,
    following_id: string
  ) => {
    try {
      await declineMutation.mutateAsync({ follower_id, following_id });
    } catch (error) {
      console.error('Error declining notification:', error);
    }
  };

  const openResourceNotification = (notification: ResourceNotification) => {
    const route = RESOURCE_ROUTES[notification.resourceType];
    if (!route) return;

    router.push({
      pathname: `/details/${route}/${route}Resource`,
      params: {
        item: JSON.stringify(notification.resource),
        from: 'notifications',
        /* Las de comentario abren el detalle con el input de comentarios enfocado. */
        ...(notification.isComment ? { focus: 'comment' } : {}),
      },
    });
  };

  return {
    loading:
      isLoading || isFetchingNextPage || acceptMutation.isPending || declineMutation.isPending,
    notifications,
    fetchNotifications, // ¡No olvides exportar esto!
    refreshNotifications,
    refreshing: isFetching && !isFetchingNextPage,
    handleAcceptNotification,
    handleDeclineNotification,
    openResourceNotification,
  };
};
