import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useCollection } from 'src/Collection/hooks/useCollection';
import { CollectionGroup } from 'src/Collection/components/CollectionGroup'; 
import { SearchBar } from 'src/Collection/components/SearchBar';
import { FilterPanel } from 'src/Collection/components/FilterPanel';

export default function CollectionScreen() {
  const {
    loading,
    busqueda, setBusqueda,
    categoriaActual, setCategoriaActual,
    menuCategoriaAbierto, setMenuCategoriaAbierto,
    filtrosAbiertos, setFiltrosAbiertos,
    orden, setOrden,
    filtroEstado, setFiltroEstado,
    soloFavoritos, setSoloFavoritos,
    handleItemPress,
    pendientes,
    enCurso,
    completados
  } = useCollection();

  const renderHorizontalList = (titulo: string, data: any[]) => {
    return (
      <View className="mb-8">
        <View className="px-4 mb-3">
          <Text className="text-xl font-bold text-primaryText">
            {titulo} <Text className="text-sm font-normal text-secondaryText">({data.length})</Text>
          </Text>
        </View>
        <FlatList
          data={data}
          horizontal={true} 
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <CollectionGroup 
              item={item} 
              category={categoriaActual} 
              onPress={() => handleItemPress(item)} 
            />
          )}
        />
      </View>
    );
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 text-3xl font-bold text-primaryText">Mi Biblioteca</Text>

        <SearchBar
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          categoriaActual={categoriaActual}
          setCategoriaActual={setCategoriaActual}
          menuAbierto={menuCategoriaAbierto}
          setMenuAbierto={setMenuCategoriaAbierto}
          filtrosAbiertos={filtrosAbiertos}
          setFiltrosAbiertos={setFiltrosAbiertos}
          isFilterActive={soloFavoritos || filtroEstado !== 'TODOS'}
        />

        {filtrosAbiertos && (
          <FilterPanel
            orden={orden}
            setOrden={setOrden}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            soloFavoritos={soloFavoritos}
            setSoloFavoritos={setSoloFavoritos}
          />
        )}

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#a855f7" />
          </View>
        ) : (
          <ScrollView 
            className="flex-1 mt-4" 
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            {renderHorizontalList('Viendo ahora', enCurso)}
            {renderHorizontalList(`${categoriaActual} pendientes`, pendientes)}
            {renderHorizontalList('Completados', completados)}

          </ScrollView>
        )}
      </View>
    </Screen>
  );
}