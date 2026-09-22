import { useAuth } from 'context/AuthContext';
import { followersServices } from '../services/followersServices';
import { User } from '@/User/hooks/useUser';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

interface FollowingPage {
  items: User[];
  nextPage?: number;
}

export const useFollowing = (username: string, activeSearch = '') => {
  const { user } = useAuth();
  const { showNotification, hideNotification } = useNotification();
  const queryClient = useQueryClient();
  const ownList = user?.user_metadata.username === username;
  const { t } = useTranslation();
  const PAGE_SIZE = 9;

  const {
    data: pagedData,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.following(username, activeSearch),
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const items = await followersServices.fetchFollowing(username, from, to, activeSearch);

      return {
        items,
        nextPage: items.length === PAGE_SIZE ? pageParam + 1 : undefined,
      };
    },
    enabled: !!username,
    initialPageParam: 0,
    getNextPageParam: (lastPage: FollowingPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    maxPages: 5,
  });

  const following = pagedData?.pages.flatMap((page: FollowingPage) => page.items) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const removeFollowingMutation = useMutation({
    mutationFn: (deleteId: string) => followersServices.removeFollowing(user.id, deleteId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.following(username) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profile(user?.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications(user?.id) }),
      ]);
    },
  });

  const handleRemoveFollower = async (usernameToRemove: string, deleteId: string) => {
    try {
      await removeFollowingMutation.mutateAsync(deleteId);
      showNotification({
        title: t('common.success'),
        description: t('profile.deleteFollowing.successDescription', {
          username: usernameToRemove,
        }),
        isChoice: false,
        delete: false,
        success: true,
      });
    } catch (error) {
      console.error('Error removing following:', error);
      showNotification({
        title: t('common.error'),
        description: t('profile.deleteFollowing.errorDescription', { username: usernameToRemove }),
        isChoice: false,
        delete: false,
        success: false,
      });
    }
  };

  const handleRemovePress = (username: string, deleteId: string) => {
    /*Alert.alert('Eliminar seguidor', `¿Deseas eliminar a ${username} de tus seguidos?`, [
		  { text: 'Cancelar', style: 'cancel' },
		  { text: 'Eliminar', style: 'destructive', onPress: () => handleRemoveFollower(username, deleteId) },
		]);*/
    showNotification({
      title: t('profile.deleteFollowing.title'),
      description: t('profile.deleteFollowing.description', { username }),
      leftButtonText: t('common.cancel'),
      rightButtonText: t('profile.deleteFollowing.title'),
      isChoice: true,
      delete: true,
      success: false,
      onLeftPress: () => hideNotification(),
      onRightPress: () => {
        hideNotification();
        handleRemoveFollower(username, deleteId);
      },
    });
  };

  return {
    following,
    loading: isLoading || isFetching || removeFollowingMutation.isPending,
    loadingMore: isFetchingNextPage,
    handleLoadMore,
    handleRemovePress,
    ownList,
  };
};
