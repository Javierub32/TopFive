import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { TopFiveItem, topFiveService } from '../services/topFiveServices';
import { router } from 'expo-router';
import { useCollection } from 'context/CollectionContext';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';

export const useTopFive = (userId: string) => {
  const { user } = useAuth();
  const { handleItemPress } = useCollection();
  const {showNotification, hideNotification} = useNotification();
  const [topFiveItems, setTopFiveItems] = useState<TopFiveItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchTopFive();
  }, [userId]);

  const fetchTopFive = async () => {
    if (!userId) return;
    try {
      setLoading(true);
	  setTopFiveItems([]);
      const topFiveData = await topFiveService.fetchTopFive(userId);
      setTopFiveItems(topFiveData);
    } catch (error) {
      console.error('Error al obtener Top Five:', error);
    } finally {
      setLoading(false);
    }
  };



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
          await topFiveService.removeFromTopFive(userId, position);
          fetchTopFive();
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
	    }
    });
	}
  }

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
    loading,
    fetchTopFive,
	handlePress,
	handleCategorySelect,
	modalVisible,
	setModalVisible,
	handleLongPress,
  };
};
