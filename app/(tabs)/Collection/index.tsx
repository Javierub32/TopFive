import { View, Text, FlatList, ScrollView, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';

import { useCollection } from 'src/Collection/hooks/useCollection';
import { SearchBar } from 'src/Collection/components/SearchBar';
import { FilterPanel } from 'src/Collection/components/FilterPanel';
import { RenderCollection } from 'src/Collection/components/RenderCollection';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { CollectionStructure } from 'components/CollectionStructure';
import { filterCollectionData } from 'src/Collection/adapters/filterCollectionData';

export default function CollectionScreen() {
  const {
    loading,
    inputBusqueda, setInputBusqueda,
    busqueda,
    handleSearch,
    categoriaActual, setCategoriaActual,
    menuCategoriaAbierto, setMenuCategoriaAbierto,
    filtrosAbiertos, setFiltrosAbiertos,
    orden, setOrden,
    filtroEstado, setFiltroEstado,
    soloFavoritos, setSoloFavoritos,
    navigateToGrid,
    handleItemPress,
    pendientes,
    enCurso,
    completados,
    data,
  } = useCollection();

  const hayBusqueda = busqueda.trim() !== '';
  
  // Filtrar datos de búsqueda para eliminar elementos sin contenido
  const dataFiltrada = hayBusqueda ? filterCollectionData(data, categoriaActual) : data;


  return (
    <Screen>
      <StatusBar style="light" />
      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 text-3xl font-bold text-primaryText">Mi Biblioteca</Text>

        <SearchBar
          value={inputBusqueda}
          onChangeText={setInputBusqueda}
          onSearch={handleSearch}
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
          <LoadingIndicator />
        ) : hayBusqueda ? (
          <CollectionStructure
            data={dataFiltrada}
            categoriaActual={categoriaActual}
            handleItemPress={handleItemPress}
          />
        
        ) : (
          <ScrollView 
            className="flex-1 mt-4" 
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <RenderCollection 
              title="En Curso"
              data={enCurso}
              category={categoriaActual}
              onPressItem={handleItemPress}
              onPressTitle={() => navigateToGrid('Viendo ahora', 'WATCHING', categoriaActual)}
            />
            <RenderCollection 
              title="Completados"
              data={completados}
              category={categoriaActual}
              onPressItem={handleItemPress}
              onPressTitle={() => navigateToGrid('Completados', 'COMPLETED', categoriaActual)}
            />
            <RenderCollection 
              title="Pendientes"
              data={pendientes}
              category={categoriaActual}
              onPressItem={handleItemPress}
              onPressTitle={() => navigateToGrid('Pendientes', 'PENDING', categoriaActual )}
            />
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}