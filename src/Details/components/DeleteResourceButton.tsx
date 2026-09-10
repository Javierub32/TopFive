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
  resources?: any[]; // <-- Añadido para soportar múltiples recursos
  type: ResourceType;
  onCustomDelete?: () => Promise<void> | void; // <-- Callback opcional para pantallas de grupo/lista
}

export const DeleteResourceButton = ({ resource, resources, type, onCustomDelete }: Props) => {
  const { colors } = useTheme();
  const { borrarRecurso } = useResource();
  const { refreshData } = useCollection();
  const { showNotification, hideNotification } = useNotification();
  const { t } = useTranslation();

  const isMultiple = resources && resources.length > 0;
  const count = resources ? resources.length : 1;

  const handleDelete = () => {
    // Si no hay recurso individual ni lista múltiple, no hace nada
    if (!resource && !isMultiple) {
      showNotification({
        title: t('common.error'),
        description: t('details.deleteResource.failedToDelete'),
        isChoice: false,
        delete: false,
        success: false,
      });
      return;
    }

    const titleText = isMultiple
      ? (t('details.deleteResource.title') || 'Eliminar recursos')
      : t('details.deleteResource.title');

    const descText = isMultiple
      ? `¿Estás seguro de que deseas eliminar los ${count} elementos seleccionados?`
      : t('details.deleteResource.description', {
          titulo: resource?.contenido?.titulo || t('details.deleteResource.thisResource'),
        });

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
        } else if (isMultiple) {
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
          showNotification({
            title: t('details.deleteResource.successTitle'),
            description: isMultiple
              ? 'Los recursos seleccionados han sido eliminados.'
              : t('details.deleteResource.resourceDeletedDescription', {
                  titulo: resource?.contenido?.titulo || t('details.deleteResource.theResource'),
                }),
            isChoice: false,
            delete: false,
            success: true,
          });
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