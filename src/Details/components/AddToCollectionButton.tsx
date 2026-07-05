import { Book, Film, Game, Series, Song } from 'app/types/Content';
import { UploadIcon } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { router } from 'expo-router';
import { useResource, ResourceType } from 'hooks/useResource';
import { TouchableOpacity } from 'react-native';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
import { useNotification } from 'context/NotificationContext';
import { useState } from 'react';
interface Props {
  content: Book | Film | Series | Song | Game;
  type: ResourceType;
}

export const AddToCollectionButton = ({ content, type }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { checkIfResourceExists } = useResource();
  const [loading, setLoading] = useState(false);
  const { showNotification, hideNotification } = useNotification();

  const ResourceMap: Record<ResourceType, { path: string; param: string }> = {
    pelicula: { path: 'film', param: 'filmData' },
    serie: { path: 'series', param: 'seriesData' },
    videojuego: { path: 'game', param: 'gameData' },
    libro: { path: 'book', param: 'bookData' },
    cancion: { path: 'song', param: 'songData' },
  };

  const openForm = (content: Book | Film | Series | Song | Game) => {
    router.push({
      pathname: '/form/' + ResourceMap[type].path,
      params: { [ResourceMap[type].param]: JSON.stringify(content) },
    });
  };

  const handleEdit = (resource: any) => {
    const path = ResourceMap[type].path;

    router.push({
      pathname: `/form/${path}` as any,
      params: {
        item: JSON.stringify(resource),
        from: 'contentDetails',
      },
    });
  };

  const handlePress = async () => {
    if (!content.id) {
      openForm(content);
      return;
    }

    setLoading(true);

    let existingResource = null;
    try {
      existingResource = await checkIfResourceExists(content.id, type);
    } finally {
      setLoading(false);
    }
    if (!existingResource) {
      openForm(content);
    } else {
      showNotification({
        title: t('common.attention'),
        description: t('details.resourceAlreadyInCollection'),
        isChoice: true,
        delete: false,
        success: false,
        leftButtonText: t('common.cancel'),
        rightButtonText: t('common.edit'),
        onLeftPress: () => hideNotification(),
        onRightPress: () => {
          hideNotification();
          handleEdit(existingResource);
        },
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="mt-4 flex-1 flex-row items-center justify-center rounded-xl py-4"
      style={{ backgroundColor: colors.primary }}>
      <UploadIcon className="mr-4" />
      <AppText className="font-bold" style={{ color: colors.background, fontSize: 14 }}>
        {loading ? t('common.loading') : t('details.addToCollection')}
      </AppText>
    </TouchableOpacity>
  );
};
