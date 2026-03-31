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
import {useNotification} from "context/NotificationContext";
import { hide } from 'expo-router/build/utils/splash';
import { TopFivePlaceholder } from "@/TopFiveSelector/components/TopFivePlaceholder";
import { LoadingIndicator } from "components/LoadingIndicator";

export default function TopFiveSelectorScreen() {
  const { data, loading, fetchTopFiveSelector, insertToTopFive } = useTopFiveSelector();
  const ContentTitle : Record<ResourceType, string> = {
    'serie': 'Series',
    'cancion': 'Canciones',
    'libro' : 'Libros',
    'videojuego' : 'Videojuegos',
    'pelicula' : 'Películas'
  }
  const { resourceType, position } = useLocalSearchParams<{
    resourceType: ResourceType;
    position: string;
  }>();
    const { showNotification, hideNotification } = useNotification();

  const handleLoadMore = () => {
    if (resourceType) {
      fetchTopFiveSelector(resourceType);
    }
  };

  const handleItemPress = async (item: ResourceMap[typeof resourceType]) => {
    if (resourceType && position) {
      showNotification({
        title: 'Confirmar selección',
        description: `¿Deseas agregar ${item.contenido.titulo} a tu Top 5?`,
        leftButtonText: 'Cancelar',
        rightButtonText: 'Confirmar',
        isChoice: true,
        delete: false,
        success: true,
        onLeftPress: () => hideNotification(),
        onRightPress: async () => {
          hideNotification();
          const posicion = parseInt(position);
          await insertToTopFive(posicion, resourceType, item.id);
          router.replace('/Profile'); 
          showNotification({
            title: '¡Éxito!',
            description: `${item.contenido.titulo} ha sido agregado a tu Top 5`,
            isChoice: false,
            delete: false,
            success: true,
          });
        }
      })
    }
  };

  return (
    <Screen>
      <ReturnButton route="/Profile" title={`${ContentTitle[resourceType]} de tu colección`} />
      <View className="flex-1 px-4">
        <CollectionStructure
          data={data}
          categoriaActual={resourceType}
          handleItemPress={handleItemPress}
          handleSearchPagination={handleLoadMore}
          showStatus={false}
          loading={loading}
        />
        {data.length == 0 && (
          <TopFivePlaceholder category={resourceType} loading={loading}/>
        )}
      </View>
    </Screen>
  );
}
