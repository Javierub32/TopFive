import React from 'react';
import { View, Text, FlatList, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; 
import { Screen } from 'components/Screen'; 
import { CollectionGroup } from 'src/Collection/components/CollectionGroup'; 
import { useCollection } from 'src/Collection/hooks/useCollection'; 
import { COLORS } from 'constants/colors';

export default function GroupScreen() {
  const params = useLocalSearchParams();
  const title = params.title as string;
  const type = params.type as string;

  const { pendientes, enCurso, completados, loading, categoriaActual, handleItemPress } = useCollection();
  
  const { width } = useWindowDimensions();
  const PADDING_PANTALLA = 40; 
  const GAP = 20;     
  const ANCHO_MINIMO_ITEM = 85;              

  const anchoDisponible = width - PADDING_PANTALLA;
  const numColumns = Math.max(2, Math.floor((anchoDisponible + GAP) / (ANCHO_MINIMO_ITEM + GAP)));
  const espacioHuecos = GAP * (numColumns - 1);
  const itemWidth = (anchoDisponible - espacioHuecos) / numColumns;
  const itemHeight = itemWidth * 1.5;

  let dataToShow: any[] = [];
  if (type === 'WATCHING') dataToShow = enCurso;
  else if (type === 'PENDING') dataToShow = pendientes;
  else if (type === 'COMPLETED') dataToShow = completados;

  return (
    <Screen>
      <View className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-primaryText mb-4">{title}</Text>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="large" />
        ) : (
          <FlatList
            key={numColumns} 
            data={dataToShow}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ gap: GAP }} 
            contentContainerStyle={{ paddingBottom: 100 }}
            
            renderItem={({ item }) => (
              <CollectionGroup 
                  item={item} 
                  category={categoriaActual} 
                  onPress={() => handleItemPress(item)} 
                  posterWidth={itemWidth}
                  posterHeight={itemHeight}
              />
            )}
          />
        )}
      </View>
    </Screen>
  );
}