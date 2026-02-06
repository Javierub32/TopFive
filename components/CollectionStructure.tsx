import { CollectionGroup } from '@/Collection/components/CollectionGroup';
import { FlatList, useWindowDimensions } from 'react-native';


export const CollectionStructure = ({ data, categoriaActual, handleItemPress, handleSearchPagination, showStatus }: any) => {
	
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
      renderItem={({ item }) => (
        <CollectionGroup 
          item={item} 
          category={categoriaActual} 
          onPress={() => handleItemPress(item)} 
          posterWidth={itemWidth}
          posterHeight={itemHeight}
          showStatus={showStatus}
        />
      )}
    />
  )
}  