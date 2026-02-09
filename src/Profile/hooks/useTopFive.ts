import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { TopFiveItem, topFiveService } from '../services/topFiveServices';
import { ResourceType } from 'hooks/useResource';
import { router } from 'expo-router';
import { useCollection } from 'context/CollectionContext';

export const useTopFive = (userId: string) => {
  const { user } = useAuth();
  const { handleItemPress } = useCollection();
  const [topFiveItems, setTopFiveItems] = useState<TopFiveItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  useEffect(() => {
    fetchTopFive();
  }, [userId]);

  const fetchTopFive = async () => {
    if (!userId) return;
    try {
      setLoading(true);
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
      handleItemPress(item.resourceData, item.type);
    } else {
      setSelectedPosition(position);
      setModalVisible(true);
    }
  };

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
  };
};
