import { useAuth } from 'context/AuthContext';
import { followersServices } from '../services/followersServices';
import { User } from '@/User/hooks/useUser';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

export const useFollowers = (username: string) => {
  const { user } = useAuth();
  const { showNotification, hideNotification } = useNotification();
  const queryClient = useQueryClient();
  const ownList = user?.user_metadata.username === username;
  const { t } = useTranslation();

  const {
    data: followers = [],
    isLoading,
    isFetching,
  } = useQuery<User[]>({
    queryKey: queryKeys.followers(username),
    queryFn: () => followersServices.fetchFollowers(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const removeFollowerMutation = useMutation({
    mutationFn: (deleteId: string) => followersServices.removeFollower(user.id, deleteId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.followers(username) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profile(user?.id) }),
      ]);
    },
  });

  const handleRemoveFollower = async (usernameToRemove: string, deleteId: string) => {
    try {
      await removeFollowerMutation.mutateAsync(deleteId);
      showNotification({
        title: t('common.success'),
        description: t('profile.deleteFollowers.successDescription', {
          username: usernameToRemove,
        }),
        isChoice: false,
        delete: false,
        success: true,
      });
    } catch (error) {
      console.error('Error removing follower:', error);
      showNotification({
        title: t('common.error'),
        description: t('profile.deleteFollowers.errorDescription', { username: usernameToRemove }),
        isChoice: false,
        delete: false,
        success: false,
      });
    }
  };

  const handleRemovePress = (username: string, deleteId: string) => {
    /*Alert.alert('Eliminar seguidor', `¿Deseas eliminar a ${username} de tus seguidores?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => handleRemoveFollower(username, deleteId) },
    ]);*/
    showNotification({
      title: t('profile.deleteFollowers.title'),
      description: t('profile.deleteFollowers.description', { username }),
      leftButtonText: t('common.cancel'),
      rightButtonText: t('common.delete'),
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
    followers,
    loading: isLoading || isFetching || removeFollowerMutation.isPending,
    handleRemovePress,
    ownList,
  };
};
