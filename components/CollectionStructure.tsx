import { CollectionGroup } from '@/Collection/components/CollectionGroup';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { LoadingIndicator } from './LoadingIndicator';
import { ResourceType } from 'hooks/useResource';
import { useFontSize } from 'context/FontSizeContext';
import { AppText } from './AppText';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'context/ThemeContext';

export const CollectionStructure = ({
  data,
  categoriaActual,
  estadoActual,
  handleItemPress,
  handleSearchPagination,
  showStatus,
  loading,
  handleLongPress,
  selectedItems
}: any) => {
  const { width } = useWindowDimensions();
  const { fontSizeMultiplier } = useFontSize();
  const PADDING_PANTALLA = 40;
  const GAP = 20;
  const ANCHO_MINIMO_ITEM = 85 * fontSizeMultiplier;

  const anchoDisponible = width - PADDING_PANTALLA;
  const numColumns = Math.max(2, Math.floor((anchoDisponible + GAP) / (ANCHO_MINIMO_ITEM + GAP)));
  const espacioHuecos = GAP * (numColumns - 1);
  const itemWidth = (anchoDisponible - espacioHuecos) / numColumns;
  const itemHeight = itemWidth * 1.5;

  const { colors } = useTheme();
  const { t } = useTranslation();
  // Mapa de traducción para las categorías
  const categoryTranslationMap: Record<ResourceType, string> = {
    libro: t('categories.books'),
    pelicula: t('categories.films'),
    serie: t('categories.series'),
    videojuego: t('categories.videogames'),
    cancion: t('categories.albums'),
  };

  return (
    <FlatList
      key={numColumns}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={{ gap: GAP }}
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
      onEndReached={handleSearchPagination}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => (loading ? <LoadingIndicator /> : null)}
      renderItem={({ item }) => (
        <CollectionGroup
          item={item}
          category={categoriaActual}
          onPress={() => handleItemPress(item)}
          posterWidth={itemWidth}
          posterHeight={itemHeight}
          showStatus={showStatus}
          onLongPress={() => handleLongPress?.(item)}
        />
      )}
      ListEmptyComponent={
        <View
          className={`fixed bottom-0 left-0 right-0 top-0 flex-1 items-center justify-center px-2 ${loading ? 'hidden' : ''}`}>
          <AppText className="mb-3 text-center font-bold"
            style={{ color: colors.secondaryText, fontSize: 20 }}>
            {t('collection.noContentDescription', { category: categoryTranslationMap[categoriaActual as ResourceType].toLowerCase(), status: (estadoActual ? estadoActual.toLowerCase() : t('list.onThisList')) })}
          </AppText>
        </View>
      }
    />
  );
};
