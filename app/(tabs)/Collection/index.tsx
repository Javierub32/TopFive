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
import NavigableCollectionScreen from 'app/borrar/a';
import ResourceList from 'app/borrar/ResourceList';

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
		{//<NavigableCollectionScreen />*/}
}
		
        <ResourceList
          categoriaActual={categoriaActual}
          navigateToGrid={navigateToGrid}
          handleItemPress={handleItemPress}
          pendientes={pendientes}
          enCurso={enCurso}
          completados={completados}
          loading={loading}
          busqueda={busqueda}
          data={data}
        />
      </View>
    </Screen>
  );
}