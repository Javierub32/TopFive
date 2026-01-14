import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useCollection } from './hooks/useCollection';
import { CollectionItem } from './components/CollectionItem';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';

export default function CollectionScreen() {
  const {
    loading,
    data,
    busqueda,
    setBusqueda,
    categoriaActual,
    setCategoriaActual,
    menuCategoriaAbierto,
    setMenuCategoriaAbierto,
    filtrosAbiertos,
    setFiltrosAbiertos,
    orden,
    setOrden,
    filtroEstado,
    setFiltroEstado,
    soloFavoritos,
    setSoloFavoritos,
    handleItemPress,
    router,
  } = useCollection();

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
          <FlatList
            data={data}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={({ item }) => (
              <CollectionItem
                item={item}
                category={categoriaActual}
                onPress={() => handleItemPress(item)}
              />
            )}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center pt-20">
                <MaterialCommunityIcons name="bookshelf" size={64} color="#334155" />
                <Text className="mt-4 text-secondaryText">No hay nada por aquí.</Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        <TouchableOpacity
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
          onPress={() => router.push('/Search')}>
          <MaterialCommunityIcons name="plus" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
