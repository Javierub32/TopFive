import { View, Text, FlatList, ScrollView, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';

import { useCollection } from 'src/Collection/hooks/useCollection';
import { SearchBar } from 'src/Collection/components/SearchBar';
import { FilterPanel } from 'src/Collection/components/FilterPanel';
import { RenderCollection } from 'src/Collection/components/RenderCollection';
import { CollectionGroup } from 'src/Collection/components/CollectionGroup';
import { LoadingIndicator } from 'components/LoadingIndicator';

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

  const { width } = useWindowDimensions();
  const PADDING_PANTALLA = 40; 
  const GAP = 20;     
  const ANCHO_MINIMO_ITEM = 85;              

  const anchoDisponible = width - PADDING_PANTALLA;
  const numColumns = Math.max(2, Math.floor((anchoDisponible + GAP) / (ANCHO_MINIMO_ITEM + GAP)));
  const espacioHuecos = GAP * (numColumns - 1);
  const itemWidth = (anchoDisponible - espacioHuecos) / numColumns;
  const itemHeight = itemWidth * 1.5;

  const hayBusqueda = busqueda.trim() !== '';
  
  // Filtrar datos de búsqueda para eliminar elementos sin contenido
  const dataFiltrada = hayBusqueda ? data.filter(item => {
    // Verificar que tenga título según la categoría
    if (categoriaActual === 'Películas' && item.contenidopelicula?.titulo) return true;
    if (categoriaActual === 'Series' && item.contenidoserie?.titulo) return true;
    if (categoriaActual === 'Videojuegos' && item.contenidovideojuego?.titulo) return true;
    if (categoriaActual === 'Libros' && item.contenidolibro?.titulo) return true;
    if (categoriaActual === 'Canciones' && item.contenidocancion?.titulo) return true;
    return false;
  }) : data;


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
          <FlatList
            key={numColumns} 
            data={dataFiltrada}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ gap: GAP }} 
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
            
            renderItem={({ item }) => (
              <CollectionGroup 
                item={item} 
                category={categoriaActual} 
                onPress={() => handleItemPress(item)} 
                posterWidth={itemWidth}
                posterHeight={itemHeight}
                showStatus={true}
              />
            )}
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