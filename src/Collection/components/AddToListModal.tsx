import { View, Modal, TouchableOpacity, Pressable, FlatList } from 'react-native';
import { ScalableIonicons, ScalableMaterialCommunityIcons } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { useLists } from '../hooks/useLists';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useCollection } from 'context/CollectionContext';
import { router } from 'expo-router';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { listServices, CollectionType } from '@/Collection/services/listServices';

const categoryMap: Record<string, CollectionType> = {
  'pelicula': 'PELICULA',
  'serie': 'SERIE',
  'videojuego': 'VIDEOJUEGO',
  'libro': 'LIBRO',
  'cancion': 'MUSICA',
};

const ModalListItem = ({ list, onSelect, colors, t, isSaved }: any) => (
  <TouchableOpacity
    className="active:bg-surfaceButton/80 flex-row items-center justify-between rounded-lg p-3"
    onPress={() => onSelect(list.id, list.tipo)}>
    <View className="flex-1 flex-row items-center pr-4">
      <View
        className="mr-3 h-12 w-12 items-center justify-center rounded-lg"
        style={{ backgroundColor: list.color || colors.primary }}>
        <ScalableMaterialCommunityIcons
          name={(list.icono as any) || 'folder-outline'}
          size={28}
          color={colors.primaryText}
        />
      </View>
      <View className="flex-1">
        <AppText
          className="text-base font-semibold"
          style={{ color: colors.primaryText, fontSize: 16 }}
          numberOfLines={1}>
          {list.nombre}
        </AppText>
        <AppText className="text-xs" style={{ color: colors.secondaryText, fontSize: 14 }} numberOfLines={1}>
          {list.descripcion || t('common.noDescription')}
        </AppText>
      </View>
    </View>
    <ScalableIonicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color={colors.secondaryText} />
  </TouchableOpacity>
);

export function AddToListModal({ visible, onClose, resourceCategory, resourceId, onSelect }: any) {
  const { colors } = useTheme();
  const { categoriaActual } = useCollection();
  const { lists, loading } = useLists(categoriaActual);
  const { t } = useTranslation();
  const [savedListIds, setSavedListIds] = useState<string[]>([]);
  const [checkingLists, setCheckingLists] = useState(false);

  useEffect(() => {
    if (visible && resourceId && categoriaActual) {
      const checkSavedLists = async () => {
        setCheckingLists(true);
        try {
          // Como tanto peliculas como series se definen como AUDIOVISUAL, hay que diferenciarlos
          let exactType = categoriaActual.toUpperCase();
          if (exactType === 'AUDIOVISUAL') {
            exactType = categoriaActual === 'serie' ? 'SERIE' : 'PELICULA';
          }

          const ids = await listServices.getListContainingItem(resourceId, exactType as CollectionType);
          setSavedListIds(ids);
        } catch (error) {
          console.error('Error al verificar las listas guardadas:', error);
        } finally {
          setCheckingLists(false);
        }
      };

      checkSavedLists();
    } else {
      setSavedListIds([]);
    }
  }, [visible, resourceId, categoriaActual]);

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'LIBRO':
        return t('categories.books');
      case 'PELICULA':
        return t('categories.films');
      case 'SERIE':
        return t('categories.series');
      case 'MUSICA':
        return t('categories.albums');
      case 'VIDEOJUEGO':
        return t('categories.videogames');
      default:
        return t('common.content');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: `${colors.background}80` }}
        onPress={onClose}>
        <Pressable
          className="max-h-[60%] w-full rounded-t-3xl p-6 shadow-2xl"
          style={{ backgroundColor: colors.surfaceButton }}
          onPress={(e) => e.stopPropagation()}>
          <AppText className="mb-4 font-bold" style={{ color: colors.primaryText, fontSize: 20 }}>
            {t('collection.saveIn')}
          </AppText>

          {loading || checkingLists ? (
            <View className="h-20">
              <LoadingIndicator />
            </View>
          ) : (
            <FlatList
              data={lists}
              extraData={savedListIds}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ModalListItem list={item} onSelect={onSelect} colors={colors} t={t} isSaved={savedListIds.includes(item.id)} />
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={() => (
                <View className="items-center p-4">
                  <AppText style={{ color: colors.secondaryText, fontSize: 14 }}>
                    {t('collection.noLists', {
                      category: getCategoryName(resourceCategory).toLowerCase(),
                    })}
                  </AppText>
                  <TouchableOpacity
                    className="mt-2"
                    onPress={() => {
                      onClose();
                      router.push('/form/list');
                    }}>
                    <AppText style={{ color: colors.primary, fontSize: 14 }}>Crear nueva lista</AppText>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
