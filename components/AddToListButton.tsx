// components/AddToListButton.tsx

import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import { AddToListModal } from '@/Collection/components/AddToListModal';
import { CollectionType, listServices } from '@/Collection/services/listServices';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';
export function AddToListButton({ resourceCategory, resourceId }: any) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const handleListSelect = async (listId: string, listType: CollectionType) => {
    setModalVisible(false);
    setLoading(true);
    try {
      const message = await listServices.addItemToList(listId, resourceId, listType);
      const header = message.includes('ya está') ? t('common.attention') : t('common.success');
      //Alert.alert(header, message);
      showNotification({
        title: header,
        description: message,
        isChoice: false,
        delete: false,
        success: !message.includes('ya está'),
      });
    } catch (error: any) {
      console.error(error);
      //Alert.alert('Error', error.message || 'No se pudo añadir a la lista.');
      showNotification({
        title: t('common.error'),
        description: error.message || t('components.errorAddToList'),
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
        onSelect={handleListSelect}
      />
    </>
  );
}
