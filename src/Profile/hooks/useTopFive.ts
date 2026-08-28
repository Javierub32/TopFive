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

  const removeItem = (position: number) => {
    removeTopFiveMutation.mutate(position);
  };

  /* const updateOrderMutation = useMutation({
    mutationFn: async (newOrder: any[]) => {
      // Filtramos los huecos vacíos y sacamos el ID y la nueva posición
      const itemsToUpdate = newOrder
        .filter((slot) => slot.item)
        .map((slot) => ({
          id: slot.item.id,
          posicion: slot.position,
        }));

      return topFiveService.updateTopFiveOrder(userId, itemsToUpdate);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.topFive(userId) });
    },
  });

  const updateOrder = (newOrder: any[]) => {
    updateOrderMutation.mutate(newOrder);
  }; */

  const saveCompleteTopFive = async (slots: { position: number; item: any | null }[]) => {
    try {
      await topFiveService.saveCompleteTopFive(userId, slots);
      // Invalidamos la caché para que cuando el usuario vuelva a ver su perfil se refresque
      await queryClient.invalidateQueries({ queryKey: queryKeys.topFive(userId) });
    } catch (error) {
      console.error("Error al guardar el Top 5 completo:", error);
      throw error;
    }
  };

  const handlePress = (position: number, item: TopFiveItem | undefined, forceOwnProfile?: boolean) => {
    if (item) {
      const isOwnProfile = forceOwnProfile !== undefined ? forceOwnProfile : (user?.id === userId); //forzamos cuando venimos de editar perfil
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

  const handleCategorySelect = (category: string, isEditing?: boolean) => {
    if (selectedPosition !== null) {
      setModalVisible(false);
      router.push({
        pathname: '/topFiveSelector',
        params: {
          resourceType: category,
          position: selectedPosition,
          ...(isEditing ? { returnToEdit: 'true' } : {}),
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
    removeItem,
    saveCompleteTopFive
  };
};
