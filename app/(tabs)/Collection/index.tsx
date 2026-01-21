import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useCollection } from 'src/Collection/hooks/useCollection';
import { SearchBar } from 'src/Collection/components/SearchBar';
import { FilterPanel } from 'src/Collection/components/FilterPanel';
import { RenderCollection } from 'src/Collection/components/RenderCollection';

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
    navigateToGrid,
    handleItemPress,
    pendientes,
    enCurso,
    completados,
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
          <ScrollView 
            className="flex-1 mt-4" 
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <RenderCollection 
              title="Pendientes"
              data={pendientes}
              category={categoriaActual}
              onPressItem={handleItemPress}
              onPressTitle={() => navigateToGrid('Pendientes', 'PENDING')}
            />
            <RenderCollection 
              title="En Curso"
              data={enCurso}
              category={categoriaActual}
              onPressItem={handleItemPress}
              onPressTitle={() => navigateToGrid('Viendo ahora', 'WATCHING')}
            />
            <RenderCollection 
              title="Completados"
              data={completados}
              category={categoriaActual}
              onPressItem={handleItemPress}
              onPressTitle={() => navigateToGrid('Completados', 'COMPLETED')}
            />
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}