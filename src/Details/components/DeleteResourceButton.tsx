import {
  BookResource,
  FilmResource,
  GameResource,
  SeriesResource,
  SongResource,
} from 'app/types/Resources';
import { useTheme } from 'context/ThemeContext';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ResourceType, useResource } from 'hooks/useResource';
import { useCollection } from 'context/CollectionContext';
import { ScalableDeleteIcon } from 'components/Icons';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';

interface Props {
  resource?: BookResource | FilmResource | SeriesResource | SongResource | GameResource | null;
  resources?: any[];
  type: ResourceType;
  onCustomDelete?: () => Promise<void> | void; 
  isList?: boolean;
}

export const DeleteResourceButton = ({ resource, resources, type, onCustomDelete, isList }: Props) => {
  const { colors } = useTheme();
  const { borrarRecurso } = useResource();
  const { refreshData } = useCollection();
  const { showNotification, hideNotification } = useNotification();
  const { t } = useTranslation();

  const hasSelection = resources && resources.length > 0;
  const isMultiple = resources && resources.length > 1;
  const count = resources ? resources.length : 1;

  const categoryTranslationMap: Record<ResourceType, string> = {
  libro: t('categories.books'),
  pelicula: t('categories.films'),
  serie: t('categories.series'),
  videojuego: t('categories.videogames'),
  cancion: t('categories.albums'),
}; 

const categoryKey = categoryTranslationMap[type];

  const handleDelete = () => {
    if (!resource && !hasSelection) {
      showNotification({
        title: t('common.error'),
        description: t('details.deleteResource.failedToDelete'),
        isChoice: false,
        delete: false,
        success: false,
      });
      return;
    }

    const titleText = t('details.deleteResource.title');

    let descText = '';
    if (isMultiple) {
      descText = !isList ? t('details.deleteResource.multipleDescription', {
        count: count,
        type: categoryKey.toLocaleLowerCase(),
      }) : t('list.deleteItemFromListNotification.multipleDescription', {
        count: count,
      });
    } else if (hasSelection && resources.length === 1) {
      descText = !isList ? t('details.deleteResource.description', {
        titulo: resources[0]?.contenido?.titulo || t('details.deleteResource.thisResource'),
      }) : t('list.deleteItemFromListNotification.description', {
        titulo: resources[0]?.contenido?.titulo ,
      });
    } else {
      descText = !isList ? t('details.deleteResource.description', {
        titulo: resource?.contenido?.titulo || t('details.deleteResource.thisResource'),
      }) : t('list.deleteItemFromListNotification.description', {
        titulo: resource?.contenido?.titulo ,
      });
    }

    showNotification({
      title: titleText,
      description: descText,
      isChoice: true,
      delete: true,
      success: false,
      leftButtonText: t('common.cancel'),
      rightButtonText: t('common.delete'),
      highlightRight: true,
      onLeftPress: () => hideNotification(),
      onRightPress: async () => {
        hideNotification();

        if (onCustomDelete) {
          await onCustomDelete();
        } else if (hasSelection) {
          await Promise.all(
            resources.map((item) => borrarRecurso(item.id, type, item.estado))
          );
          refreshData(type);
        } else if (resource) {
          await borrarRecurso(resource.id, type, resource.estado);
          router.replace({
            pathname: '/Collection',
            params: { initialResource: type as ResourceType },
          });
          refreshData(type);
        }

        setTimeout(() => {
          const currentTitle = resource?.contenido?.titulo || resources?.[0]?.contenido?.titulo || '';
          if (!isList) {
          showNotification({
            title:  t('details.deleteResource.successTitle'),
            description: isMultiple
              ? t('details.deleteResource.multipleSuccessDescription', {
                  count: count,
                  type: categoryKey.toLocaleLowerCase(),
                })
              : t('details.deleteResource.resourceDeletedDescription', {
                  titulo: currentTitle || t('details.deleteResource.theResource'),
                }),
            isChoice: false,
            delete: false,
            success: true,
          });
        } else {
          showNotification({
            title: t('list.deleteItemFromListNotification.title'),
            description: isMultiple
              ? t('list.deleteItemFromListNotification.multipleConfirmationDescription')
              : t('list.deleteItemFromListNotification.confirmationDescription', {
                  titulo: currentTitle ,
                }),
            isChoice: false,
            delete: false,
            success: true,
          });
        }
        }, 100);
      },
    });
  };

  return (
    <TouchableOpacity
      onPress={handleDelete}
      className="mr-2 h-10 w-10 items-center justify-center rounded-full"
      style={{ backgroundColor: colors.error }}
      activeOpacity={0.7}>
      <ScalableDeleteIcon />
    </TouchableOpacity>
  );
};