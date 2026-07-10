import { CollectionType, ListInfo, listServices } from '../services/listServices';
import { useAuth } from 'context/AuthContext';
import { router } from 'expo-router';
import { ResourceType } from 'hooks/useResource';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

const categoryMap: Record<ResourceType, CollectionType> = {
  pelicula: 'PELICULA',
  serie: 'SERIE',
  videojuego: 'VIDEOJUEGO',
  libro: 'LIBRO',
  cancion: 'CANCION',
};

export const useLists = (categoriaActual: ResourceType) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const collectionType = categoryMap[categoriaActual] as CollectionType;

  const {
    data: lists = [],
    isLoading,
    isFetching,
    refetch: fetchListInfo,
  } = useQuery<ListInfo[]>({
    queryKey: queryKeys.lists(user?.id, collectionType),
    queryFn: () => listServices.fetchListInfo(user.id, collectionType),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });

  const invalidateLists = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.lists(user?.id, collectionType) }),
      queryClient.invalidateQueries({ queryKey: ['lists'] }),
    ]);
  };

  const createListMutation = useMutation({
    mutationFn: ({
      nombre,
      descripcion,
      icono,
      color,
    }: {
      nombre: string;
      descripcion: string | null;
      icono: string | null;
      color: string | null;
    }) => listServices.createList(user.id, nombre, descripcion, icono, color, collectionType),
    onSuccess: invalidateLists,
  });

  const updateListMutation = useMutation({
    mutationFn: ({
      listId,
      nombre,
      descripcion,
      icono,
      color,
    }: {
      listId: string;
      nombre: string;
      descripcion: string | null;
      icono: string | null;
      color: string | null;
    }) => listServices.updateList(user.id, listId, nombre, descripcion, icono, color),
    onSuccess: invalidateLists,
  });

  const deleteListMutation = useMutation({
    mutationFn: (listId: string) => listServices.deleteList(user.id, listId),
    onSuccess: invalidateLists,
  });

  const createList = async (
    nombre: string,
    descripcion: string | null,
    icono: string | null,
    color: string | null,
    tipo: string
  ) => {
    try {
      await createListMutation.mutateAsync({ nombre, descripcion, icono, color });
      router.back();
      setTimeout(() => {
        showNotification({
          title: t('list.listCreatedNotification.title'),
          description: t('list.listCreatedNotification.description', { listName: nombre }),
          isChoice: false,
          delete: false,
          success: true,
        });
      }, 100);
      /*Alert.alert("Lista creada", `La lista "${nombre}" ha sido creada exitosamente.`,
				[{ text: "OK", 
					onPress: () => router.push({ pathname: '/Lists', params: { initialResource: categoriaActual as ResourceType } }) }]
			 );*/
    } catch (error) {
      console.error('Error creating list:', error);
      showNotification({
        title: t('common.error'),
        description: t('list.couldntCreateError'),
        isChoice: false,
        delete: false,
        success: false,
      });
      //Alert.alert("Error", "No se pudo crear la lista. Por favor, inténtalo de nuevo.");
    }
  };

  const updateList = async (
    listId: string,
    nombre: string,
    descripcion: string | null,
    icono: string | null,
    color: string | null
  ) => {
    try {
      await updateListMutation.mutateAsync({ listId, nombre, descripcion, icono, color });
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  const deleteList = async (listId: string) => {
    try {
      await deleteListMutation.mutateAsync(listId);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  return {
    loading:
      isLoading ||
      isFetching ||
      createListMutation.isPending ||
      updateListMutation.isPending ||
      deleteListMutation.isPending,
    lists,
    createList,
    updateList,
    deleteList,
    fetchListInfo,
    data: [],
  };
};
