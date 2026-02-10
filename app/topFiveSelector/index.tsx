import { CollectionGroup } from '@/Collection/components/CollectionGroup';
import { useTopFive } from '@/Profile/hooks/useTopFive';
import { useTopFiveSelector } from '@/TopFiveSelector/hooks/useTopFiveSelector';
import { CollectionStructure } from 'components/CollectionStructure';
import { ReturnButton } from 'components/ReturnButton';
import { Screen } from 'components/Screen';
import { useAuth } from 'context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { ResourceMap, ResourceType } from 'hooks/useResource';
import { useEffect } from 'react';
import { Alert, View } from 'react-native';

export default function TopFiveSelectorScreen() {
  const { data, loading, fetchTopFiveSelector, insertToTopFive } = useTopFiveSelector();
  const { resourceType, position } = useLocalSearchParams<{
    resourceType: ResourceType;
    position: string;
  }>();

  const handleLoadMore = () => {
    if (resourceType) {
      fetchTopFiveSelector(resourceType);
    }
  };

  const handleItemPress = async (item: ResourceMap[typeof resourceType]) => {
    if (resourceType && position) {
      Alert.alert(
        'Confirmar selección',
        `¿Deseas agregar este item a tu Top 5?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Confirmar',
            onPress: async () => {
              const posicion = parseInt(position);
              await insertToTopFive(posicion, resourceType, item.id);
			  router.replace('/Profile'); 
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <Screen>
      <ReturnButton route="/Profile" title="Volver a perfil" />
      <View className=" flex-1 px-4">
        <CollectionStructure
          data={data}
          categoriaActual={resourceType}
          handleItemPress={handleItemPress}
          handleSearchPagination={handleLoadMore}
          showStatus={false}
          loading={loading}
        />
      </View>
    </Screen>
  );
}
