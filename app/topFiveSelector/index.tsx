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
  const { t } = useTranslation();

  const ContentTitle: Record<ResourceType, string> = {
    serie: t('categories.series'),
    cancion: t('categories.albums'),
    libro: t('categories.books'),
    videojuego: t('categories.videogames'),
    pelicula: t('categories.films'),
  };
  const { resourceType, position, returnToEdit } = useLocalSearchParams<{
    resourceType: ResourceType;
    position: string;
    returnToEdit?: string;
  }>();

  const { data, loading, fetchTopFiveSelector, insertToTopFive } = useTopFiveSelector(resourceType);
  const { showNotification, hideNotification } = useNotification();

  const handleLoadMore = () => {
    if (resourceType) {
      fetchTopFiveSelector();
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
          if (returnToEdit === 'true') {  //si viene del edit profile, para que no se actualice a tiempo real => dismissTo, de otra manera se actualizaba
            router.dismissTo({
              pathname: '/editProfile',
              params: {
                addedItem: JSON.stringify(item),
                targetPosition: position,
                addedItemType: resourceType,
              },
            });
          }
          else{
            try {
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
            } catch (error: any) {
              showNotification({
                title: t('common.error'),
                description:
                  error?.message === 'TOP_FIVE_DUPLICATE_RESOURCE'
                    ? t('topFiveSelector.duplicateResource')
                    : t('topFiveSelector.addToTopFiveError'),
                isChoice: false,
                delete: false,
                success: false,
              });
            }

          }
        },
      });
    }
  };

  return (
    <Screen>
      <ReturnButton
        route={returnToEdit === 'true' ? 'back' : '/Profile'}
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
