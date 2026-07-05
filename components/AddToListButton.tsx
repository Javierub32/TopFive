import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import { AddToListModal } from '@/Collection/components/AddToListModal';
import { CollectionType, listServices } from '@/Collection/services/listServices';
import { useNotification } from 'context/NotificationContext';
export function AddToListButton({ resourceCategory, resourceId }: any) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  
  const handleListSelect = async (listId: string, listType: CollectionType) => {
    setModalVisible(false);
    setLoading(true);
    try {
      let exactType = listType;
      if (listType === 'AUDIOVISUAL') {
        exactType = resourceCategory === 'serie' ? 'SERIE' : 'PELICULA';
      } else if (listType === 'MUSICA') {
         exactType = 'CANCION';
      }
      const message = await listServices.addItemToList(listId, resourceId, exactType);
      showNotification({
        title: 'Éxito',
        description: message,
        isChoice: false,
        delete: false,
        success: true,
      });
    } catch (error: any) {
      console.error(error);
      showNotification({
        title: 'Error',
        description: error.message || 'No se pudo añadir a la lista.',
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        disabled={loading}
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
