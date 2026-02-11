import { CollectionGroup } from '@/Collection/components/CollectionGroup';
import { FlatList, useWindowDimensions } from 'react-native';
import { LoadingIndicator } from './LoadingIndicator';
import { View } from 'react-native-reanimated/lib/typescript/Animated';
import { ResourceType } from 'hooks/useResource';
import { CollectionType } from '@/Collection/services/listServices';

const categoryMap: Record<ResourceType, CollectionType> = {
	'pelicula': 'PELICULA',
	'serie': 'SERIE',
	'videojuego': 'VIDEOJUEGO',
	'libro': 'LIBRO',
	'cancion': 'CANCION',
};


export const CollectionStructure = ({ data, categoriaActual, handleItemPress, handleSearchPagination, showStatus, loading, handleLongPress }: any) => {
	
  const { width } = useWindowDimensions();
  const PADDING_PANTALLA = 40; 
  const GAP = 20;     
  const ANCHO_MINIMO_ITEM = 85;              

  const anchoDisponible = width - PADDING_PANTALLA;
  const numColumns = Math.max(2, Math.floor((anchoDisponible + GAP) / (ANCHO_MINIMO_ITEM + GAP)));
  const espacioHuecos = GAP * (numColumns - 1);
  const itemWidth = (anchoDisponible - espacioHuecos) / numColumns;
  const itemHeight = itemWidth * 1.5;
  return(
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
	  ListFooterComponent={() => 
		loading ? 
			<LoadingIndicator  /> : null
	  }  
      renderItem={({ item }) => (
        <CollectionGroup 
          item={item} 
          category={categoriaActual} 
          onPress={() => handleItemPress(item)} 
          posterWidth={itemWidth}
          posterHeight={itemHeight}
          showStatus={showStatus}
          onLongPress={() => handleLongPress(item.id, categoryMap[categoriaActual as ResourceType])}
        />
      )}
    />
  )
}  