import { useAuth } from 'context/AuthContext';
import { useState } from 'react';
import { TopFiveItem, topFiveService } from '../services/topFiveServices';
import { router } from 'expo-router';
import { useCollection } from 'context/CollectionContext';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

export const useTopFive = (userId: string) => {
  const { user } = useAuth();
  const { handleItemPress } = useCollection();
  const { showNotification, hideNotification } = useNotification();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const { t } = useTranslation();

  const {
    data: topFiveItems = [],
    isLoading,
    isFetching,
    refetch: fetchTopFive,
  } = useQuery<TopFiveItem[]>({
    queryKey: queryKeys.topFive(userId),
    queryFn: () => topFiveService.fetchTopFive(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });

  const removeTopFiveMutation = useMutation({
    mutationFn: (position: number) => topFiveService.removeFromTopFive(userId, position),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.topFive(userId) });
    },
  });

  const handlePress = (position: number, item: TopFiveItem | undefined) => {
    if (item) {
      const isOwnProfile = user?.id === userId;
      handleItemPress(item.resourceData, item.type, isOwnProfile ? 'profile' : 'user');
    } else {
      setSelectedPosition(position);
      setModalVisible(true);
    }
  };

  const handleLongPress = (position: number, item: TopFiveItem | undefined) => {
    if (item) {
      showNotification({
        title: t('profile.removeFromTopFiveNotification.title'),
        description: t('profile.removeFromTopFiveNotification.description'),
        leftButtonText: t('common.cancel'),
        rightButtonText: t('common.delete'),
        isChoice: true,
        delete: true,
        success: false,
        onLeftPress: () => hideNotification(),
        onRightPress: async () => {
          try {
            hideNotification();
            await removeTopFiveMutation.mutateAsync(position);
            showNotification({
              title: t('common.success'),
              description: t('profile.removeFromTopFiveNotification.confirmationDescription'),
              isChoice: false,
              delete: false,
              success: true,
            });
          } catch (error) {
            console.error('Error al eliminar item del Top 5:', error);
          }
        },
      });
    }
  };

  const handleCategorySelect = (category: string) => {
    if (selectedPosition !== null) {
      setModalVisible(false);
      router.push({
        pathname: '/topFiveSelector',
        params: {
          resourceType: category,
          position: selectedPosition,
        },
      });
    }
  };

  return {
    topFiveItems,
    loading: isLoading || isFetching || removeTopFiveMutation.isPending,
    fetchTopFive,
    handlePress,
    handleCategorySelect,
    modalVisible,
    setModalVisible,
    handleLongPress,
  };
};
