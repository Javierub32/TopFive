import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { TopFiveItem, topFiveService } from '../services/topFiveServices';
import { ResourceType } from 'hooks/useResource';
import { router } from 'expo-router';
import { useCollection } from 'context/CollectionContext';
import { Alert } from 'react-native';

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
      handleItemPress(item.resourceData, item.type);
    } else {
      setSelectedPosition(position);
      setModalVisible(true);
    }
  };

  const handleLongPress = (position: number, item: TopFiveItem | undefined) => {
	if (item) {
		Alert.alert(
			'Eliminar de Top 5',
			'¿Deseas eliminar este item de tu Top 5?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Eliminar',
					style: 'destructive',
					onPress: async () => {
						try {
							await topFiveService.removeFromTopFive(userId, position);
							fetchTopFive();
						} catch (error) {
							console.error('Error al eliminar item del Top 5:', error);
						}
					},
				},
			],
			{ cancelable: true }
		);
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
