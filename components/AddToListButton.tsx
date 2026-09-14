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
import { useCollection } from 'context/CollectionContext';

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
  const { clearSelectedItems } = useCollection();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const multipleMode = Array.isArray(resourceId) 
  const itemIdsToSave = multipleMode ? resourceId : [resourceId];

  const addToListMutation = useMutation({
    mutationFn: async ({ listId, listType, itemIds, isMultipleFlag }: { listId: string; listType: CollectionType; itemIds: any[]; isMultipleFlag: boolean }) => {
      const exactType = getExactListType(listType, resourceCategory);
      const promises = itemIds.map(id => listServices.addItemToList(listId, id, exactType, isMultipleFlag));
      return await Promise.all(promises);
    },
    onSuccess: async (_message, { listId, listType }) => {
      const exactType = getExactListType(listType, resourceCategory);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.listsPrefix() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.listDetails(listId, exactType) }),
        queryClient.invalidateQueries({ queryKey: ['lists'] }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.listContainingItem(resourceId, exactType),
        }),
      ]);
    },
  });

  const handleListSelect = async (listId: string, listType: CollectionType, itemIds: any[]) => {
    setModalVisible(false);
    try {
      const results = await addToListMutation.mutateAsync({ listId, listType, itemIds, isMultipleFlag: multipleMode });
      if (multipleMode) {
        clearSelectedItems(); 
        showNotification({
          title: t('common.success'),
          description: itemIds.length === 1 ? t('list.addItemToListNotification.confirmationDescription') : t('list.addItemToListNotification.multipleConfirmationDescription'),
          isChoice: false,
          delete: false,
          success: true,
        });
      } else {
        showNotification({
          title: t('common.success'),
          description: results[0] === 'Recurso añadido a la lista exitosamente.' ? t('list.addItemToListNotification.confirmationDescription'): t('list.deleteItemFromListNotification.multipleConfirmationDescription') ,
          isChoice: false,
          delete: false,
          success: true,
        });
      }
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
        disabled={!resourceId || resourceId.length === 0}
        className="mr-2 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: `${colors.accent}99` }}
        activeOpacity={0.7}>
        <MaterialCommunityIcons name="playlist-plus" size={20} color={colors.primaryText} />
      </TouchableOpacity>

      <AddToListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        resourceCategory={resourceCategory}
        itemIds={itemIdsToSave}
        isMultiple={multipleMode}
        onSelect={handleListSelect}
      />
    </>
  );
}
