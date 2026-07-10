import { useState } from 'react';
import { useResource, ResourceType } from 'hooks/useResource';
import { listServices, CollectionType } from '../services/listServices';
import { useNotification } from 'context/NotificationContext';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';
import { useAuth } from 'context/AuthContext';
const typeMapping: Record<string, ResourceType> = {
  LIBRO: 'libro',
  PELICULA: 'pelicula',
  SERIE: 'serie',
  VIDEOJUEGO: 'videojuego',
  ALBUM: 'cancion',
  CANCION: 'cancion',
  MUSICA: 'cancion',
};

export const useItemSelector = (category: string | undefined, listId: string | undefined) => {
  const { user } = useAuth();
  const { fetchResources } = useResource();
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const resourceType = category ? typeMapping[category] : 'pelicula';

  const {
    data: resourcesData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.resources(user?.id, resourceType, { selector: 'list-item', category }),
    queryFn: () =>
      fetchResources({
        type: resourceType,
        ordenarPorFecha: true,
      }),
    enabled: !!category && !!user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const addItemMutation = useMutation({
    mutationFn: (itemId: number) =>
      listServices.addItemToList(listId!, itemId, category as CollectionType),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.listDetails(listId, category) }),
        queryClient.invalidateQueries({ queryKey: ['lists'] }),
      ]);
    },
  });

  const addItem = async (itemId: number) => {
    try {
      // Este mensaje avisa si se ha guardado correctamente o si el contenido ya estaba en la lista
      const message = await addItemMutation.mutateAsync(itemId);
      const isSuccess = !message.includes('ya está'); // Viene del mensaje Este contenido ya está en la lista

      showNotification({
        title: isSuccess ? t('common.success') : t('common.attention'),
        description: message,
        isChoice: false,
        delete: false,
        success: isSuccess,
      });

      if (isSuccess) router.back();
    } catch (error: any) {
      console.error(error);
    }
  };

  return {
    data: resourcesData?.data || [],
    loading: isLoading || isFetching || addItemMutation.isPending,
    addItem,
    resourceType,
  };
};
