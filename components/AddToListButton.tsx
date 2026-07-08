import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import { AddToListModal } from '@/Collection/components/AddToListModal';
import { CollectionType, listServices } from '@/Collection/services/listServices';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

const getExactListType = (listType: CollectionType, resourceCategory: string): CollectionType => {
  if (listType === 'AUDIOVISUAL') {
    return resourceCategory === 'serie' ? 'SERIE' : 'PELICULA';
  }

  if (listType === 'MUSICA') {
    return 'CANCION';
  }

  return listType;
};

export function AddToListButton({ resourceCategory, resourceId }: any) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const addToListMutation = useMutation({
    mutationFn: ({
      listId,
      listType,
    }: {
      listId: string;
      listType: CollectionType;
    }) => {
      const exactType = getExactListType(listType, resourceCategory);
      return listServices.addItemToList(listId, resourceId, exactType);
    },
    onSuccess: async (_message, { listId, listType }) => {
      const exactType = getExactListType(listType, resourceCategory);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['lists'] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.listDetails(listId, exactType) }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.listContainingItem(resourceId, exactType),
        }),
      ]);
    },
  });

  const handleListSelect = async (listId: string, listType: CollectionType) => {
    setModalVisible(false);
    try {
      const message = await addToListMutation.mutateAsync({ listId, listType });
      showNotification({
        title: t('common.success'),
        description: message,
        isChoice: false,
        delete: false,
        success: true,
      });
    } catch (error: any) {
      console.error(error);
      showNotification({
        title: t('common.error'),
        description: error.message || t('components.errorAddToList'),
        isChoice: false,
        delete: false,
        success: false,
      });
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        disabled={addToListMutation.isPending}
        className="mr-2 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: `${colors.accent}99` }}
        activeOpacity={0.7}>
        <MaterialCommunityIcons name="playlist-plus" size={20} color={colors.primaryText} />
      </TouchableOpacity>

      <AddToListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        resourceCategory={resourceCategory}
        resourceId={resourceId}
        onSelect={handleListSelect}
      />
    </>
  );
}
