// components/AddToListButton.tsx

import React, { useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import { AddToListModal } from '@/Collection/components/AddToListModal';
import { CollectionType, listServices } from '@/Collection/services/listServices';

export function AddToListButton({ resourceCategory, resourceId }: any) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleListSelect = async (listId: string, listType: CollectionType) => {
    setModalVisible(false);
    setLoading(true);
    try {
      const message = await listServices.addItemToList(listId, resourceId, listType);
	  const header = message.includes('ya está') ? 'Atención' : 'Éxito';
      Alert.alert(header, message);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'No se pudo añadir a la lista.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        disabled={loading}
        className="mr-2 h-10 w-10 items-center justify-center rounded-full border-2"
        style={{ backgroundColor: `${colors.accent}99`, borderColor: colors.accent }}
        activeOpacity={0.7}>
        <MaterialCommunityIcons name="playlist-plus" size={20} color={colors.primaryText} />
      </TouchableOpacity>

      <AddToListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        resourceCategory={resourceCategory}
        onSelect={handleListSelect}
      />
    </>
  );
}
