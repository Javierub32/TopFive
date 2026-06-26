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
import { DeleteIcon } from 'components/Icons';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';

interface Props {
  resource: BookResource | FilmResource | SeriesResource | SongResource | GameResource | null;
  type: ResourceType;
}

export const DeleteResourceButton = ({ resource, type }: Props) => {
  const { colors } = useTheme();
  const { borrarRecurso } = useResource();
  const { refreshData } = useCollection();
  const { showNotification, hideNotification } = useNotification();
  const { t } = useTranslation();

  const handleDelete = () => {
    if (resource) {
      showNotification({
        title: t('details.deleteResource.title'),
        description: t('details.deleteResource.description', {
          titulo: resource.contenido.titulo || 'este recurso',
        }),
        isChoice: true,
        delete: true,
        success: false,
        leftButtonText: t('common.cancel'),
        rightButtonText: t('common.delete'),
        highlightRight: true,
        onLeftPress: () => hideNotification(),
        onRightPress: async () => {
          hideNotification();
          await borrarRecurso(resource.id, type, resource.estado);
          router.replace({
            pathname: '/Collection',
            params: { initialResource: type as ResourceType },
          });
          refreshData();
          setTimeout(() => {
            showNotification({
              title: t('details.deleteResource.successTitle'),
              description: t('details.deleteResource.resourceDeletedDescription', {
                titulo: resource.contenido.titulo || 'el recurso',
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        },
      });
    } else {
      showNotification({
        title: t('common.error'),
        description: t('details.deleteResource.failedToDelete'),
        isChoice: false,
        delete: false,
        success: false,
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={handleDelete}
      className="mr-2 h-10 w-10 items-center justify-center rounded-full"
      style={{ backgroundColor: colors.error }}
      activeOpacity={0.7}>
      <DeleteIcon />
    </TouchableOpacity>
  );
};
