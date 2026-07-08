import { notificationServices } from '../services/notificationServices';
import { useAuth } from 'context/AuthContext';
import { supabase } from 'lib/supabase';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

interface NotificationsPage {
  items: any[];
  nextPage?: number;
}

export const useNotification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const pageSize = 10;

  const enrichNotifications = async (data: any[]) => {
    if (!user?.id) return data;

    const { data: myFollows } = await supabase
      .from('relationships')
      .select('following_id, status')
      .eq('follower_id', user.id);

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
        const data = await notificationServices.fetchNotifications(user!.id, from, to);
        const enriched = await enrichNotifications(data);

        return {
          items: enriched,
          nextPage: data.length === pageSize ? pageParam + 1 : undefined,
        };
      },
      enabled: !!user?.id,
      initialPageParam: 0,
      getNextPageParam: (lastPage: NotificationsPage) => lastPage.nextPage,
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 30,
      maxPages: 5,
    });

  const notifications = data?.pages.flatMap((page: NotificationsPage) => page.items) ?? [];

  const fetchNotifications = async () => {
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
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

  return {
    loading:
      isLoading || isFetchingNextPage || acceptMutation.isPending || declineMutation.isPending,
    notifications,
    fetchNotifications, // ¡No olvides exportar esto!
    refreshNotifications,
    refreshing: isFetching && !isFetchingNextPage,
    handleAcceptNotification,
    handleDeclineNotification,
  };
};
