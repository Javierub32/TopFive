import { useTopFiveSelector } from '@/TopFiveSelector/hooks/useTopFiveSelector';
import { CollectionStructure } from 'components/CollectionStructure';
import { ReturnButton } from 'components/ReturnButton';
import { Screen } from 'components/Screen';
import { router, useLocalSearchParams } from 'expo-router';
import { ResourceMap, ResourceType } from 'hooks/useResource';
import { View } from 'react-native';
import { useNotification } from 'context/NotificationContext';
import { TopFivePlaceholder } from '@/TopFiveSelector/components/TopFivePlaceholder';
import { useTranslation } from 'react-i18next';
export default function TopFiveSelectorScreen() {
  const { data, loading, fetchTopFiveSelector, insertToTopFive } = useTopFiveSelector();
  const { t } = useTranslation();

  const ContentTitle: Record<ResourceType, string> = {
    serie: t('categories.series'),
    cancion: t('categories.albums'),
    libro: t('categories.books'),
    videojuego: t('categories.videogames'),
    pelicula: t('categories.films'),
  };
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
        title: t('topFiveSelector.confirmSelection'),
        description: t('topFiveSelector.confirmSelectionDescription', {
          title: item.contenido.titulo,
        }),
        leftButtonText: t('common.cancel'),
        rightButtonText: t('common.confirm'),
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
            title: t('common.success'),
            description: t('topFiveSelector.addedToTopFive', { title: item.contenido.titulo }),
            isChoice: false,
            delete: false,
            success: true,
          });
        },
      });
    }
  };

  return (
    <Screen>
      <ReturnButton
        route="/Profile"
        title={t('topFiveSelector.categoryOfYourCollectionTitle', {
          category: ContentTitle[resourceType],
        })}
      />
      <View className="flex-1 px-4">
        <CollectionStructure
          data={data}
          categoriaActual={resourceType}
          handleItemPress={handleItemPress}
          handleSearchPagination={handleLoadMore}
          showStatus={false}
          loading={loading}
        />
        {data.length === 0 && <TopFivePlaceholder category={resourceType} loading={loading} />}
      </View>
    </Screen>
  );
}
