// src/Collection/hooks/useListsDetails.ts
import { CollectionType, listServices } from '../services/listServices';
import { ResourceType } from 'hooks/useResource';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

const categoryMap: Record<ResourceType, CollectionType> = {
  pelicula: 'PELICULA',
  serie: 'SERIE',
  videojuego: 'VIDEOJUEGO',
  libro: 'LIBRO',
  cancion: 'CANCION',
};

const PAGE_SIZE = 9; // Cantidad de elementos a cargar por página

interface ListDetailsPage {
  items: any[];
  nextPage?: number;
}

export const useListsDetails = (categoriaActual: ResourceType, listId: string) => {
  const { showNotification, hideNotification } = useNotification();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const collectionType = categoryMap[categoriaActual] as CollectionType;

  const {
    data: pagedData,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKeys.listDetails(listId, collectionType),
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const items = await listServices.fetchListDetails(listId, collectionType, from, to);

      return {
        items,
        nextPage: items.length === PAGE_SIZE ? pageParam + 1 : undefined,
      };
    },
    enabled: !!listId && !!categoriaActual,
    initialPageParam: 0,
    getNextPageParam: (lastPage: ListDetailsPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    maxPages: 5,
  });

  const data = pagedData?.pages.flatMap((page: ListDetailsPage) => page.items) ?? [];

  // Función para cargar la siguiente página
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const resetListDetails = () => {
    refetch();
  };

  const deleteItemMutation = useMutation({
    mutationFn: ({ itemId, type }: { itemId: string; type: CollectionType }) =>
      listServices.removeItemFromList(listId, itemId, type),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.listDetails(listId, collectionType) }),
        queryClient.invalidateQueries({ queryKey: ['lists'] }),
      ]);
    },
  });

  const handleDeleteItem = async (itemId: string, type: CollectionType) => {
    showNotification({
      title: t('list.deleteItemFromListNotification.title'),
      description: t('list.deleteItemFromListNotification.description'),
      leftButtonText: t('common.cancel'),
      rightButtonText: t('common.confirm'),
      isChoice: true,
      delete: true,
      success: false,
      onLeftPress: () => hideNotification(),
      onRightPress: async () => {
        hideNotification();
        await deleteItemMutation.mutateAsync({ itemId, type });
        showNotification({
          title: t('common.success'),
          description: t('list.deleteItemFromListNotification.confirmationDescription'),
          isChoice: false,
          delete: false,
          success: true,
        });
      },
    });
  };

  return {
    loading: isLoading || isFetchingNextPage || deleteItemMutation.isPending,
    data,
    handleLoadMore,
    hasMore: !!hasNextPage,
    handleDeleteItem,
  };
};
