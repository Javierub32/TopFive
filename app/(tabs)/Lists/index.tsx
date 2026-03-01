import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, useWindowDimensions, Animated, LayoutChangeEvent } from 'react-native';
import { Screen } from 'components/Screen';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { useCollection } from 'context/CollectionContext';
import { useLists } from '@/Collection/hooks/useLists';
import { ResourceType } from 'hooks/useResource';
import { ListItem } from '@/Collection/components/ListItem';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { router } from 'expo-router';
import { TabView } from 'react-native-tab-view';
import { BookIcon, FilmIcon, ShowIcon, GameIcon, MusicIcon } from 'components/Icons';
import { CategoryTabBar } from 'components/CategoryTarBar';
import Lists from '@/Collection/components/Lists';

export default function ListScreen() {
  const { colors } = useTheme();
  const layout = useWindowDimensions();
  const { categoriaActual, setCategoriaActual } = useCollection();
  const [isChanging, setIsChanging] = useState(false);

  const { lists, loading, deleteList } = useLists(categoriaActual as ResourceType);

  const [routes] = useState([
    { key: 'libro', nombre: 'Libros' },
    { key: 'pelicula', nombre: 'Películas' },
    { key: 'serie', nombre: 'Series' },
    { key: 'videojuego', nombre: 'Juegos' },
    { key: 'cancion', nombre: 'Música' },
  ]);

  const index = routes.findIndex(r => r.key === categoriaActual);
  const safeIndex = index === -1 ? 0 : index;

   const handleIndexChange = (i: number) => {
    setIsChanging(true);
    setCategoriaActual(routes[i].key as ResourceType);

    // Forzamos un delay de 300ms (lo que tarda la animación de deslizamiento)
    // para que no se vea nada hasta que la transición termine.
    setTimeout(() => {
      setIsChanging(false);
    }, 350); 
  };



  const renderScene = ({ route }: any) => {
    if (isChanging || route.key !== categoriaActual || loading) {
      return (
        <View className="flex-1 justify-center items-center mt-10" style={{ backgroundColor: colors.background }}>
           <LoadingIndicator />
        </View>
      );
    }

    if (loading) {
      return (
        <View className="flex-1 justify-center items-center mt-10">
          <LoadingIndicator />
        </View>
      );
    }

    return (
	  <Lists data={lists} placeholder={route.nombre.toLowerCase()} deleteList={deleteList} />
    );
	
  };

  return (
    <Screen>
      <ThemedStatusBar />
      <View className="flex-1 px-4 pt-6">
        
        <View className="mt-2 mb-4 flex-row items-end justify-between">
            <Text className="text-3xl font-bold" style={{ color: colors.primaryText }}>Listas</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/form/list")}>
                <Text className="text-xl" style={{ color: colors.primary }}>+ Nueva lista</Text>
            </TouchableOpacity>
        </View>

        <TabView
          navigationState={{ index: safeIndex, routes }}
          renderScene={renderScene}
          renderTabBar={(props) => <CategoryTabBar {...props} />}
          onIndexChange={handleIndexChange}
          initialLayout={{ width: layout.width }}
          swipeEnabled={true} 
          style={{ flex: 1 }}
        />
      </View>
    </Screen>
  );
}