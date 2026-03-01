// app/(tabs)/Collection/index.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { Screen } from 'components/Screen';
import { SearchBar } from 'src/Collection/components/SearchBar';
import ResourceList from '@/Collection/components/ResourceList';
import { CancelIcon2, SearchIcon2 } from 'components/Icons';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';
import { ResourceType } from 'hooks/useResource';
import { CategoryTabBar } from 'components/CategoryTarBar';

export default function CollectionScreen() {
  const layout = useWindowDimensions();
  const { colors } = useTheme();
  const { categoriaActual, setCategoriaActual, isSearchVisible, toggleSearch } = useCollection();
  const [isChanging, setIsChanging] = useState(false);

  const routes = [
    { key: 'libro', title: 'Libros' },
    { key: 'pelicula', title: 'Películas' },
    { key: 'serie', title: 'Series' },
    { key: 'videojuego', title: 'Juegos' },
    { key: 'cancion', title: 'Música' },
  ];

  const index = routes.findIndex(r => r.key === categoriaActual);
  const safeIndex = index === -1 ? 0 : index;

  const handleIndexChange = (i: number) => {
    setIsChanging(true);
    setCategoriaActual(routes[i].key as ResourceType);
    
    // Pequeño timeout para que la animación del TabView fluya antes de cargar los datos
    setTimeout(() => setIsChanging(false), 300);
  };

  const renderScene = ({ route }: any) => {
    // Si la pestaña no coincide con el contexto global o está cambiando, mostramos loader
    if (isChanging || route.key !== categoriaActual) {
      return (
        <View className="flex-1 justify-center items-center">
          <LoadingIndicator />
        </View>
      );
    }
    return <ResourceList />;
  };

  return (
    <Screen>
      <View className="flex-1 px-4 pt-6">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-3xl font-bold" style={{ color: colors.primaryText }}>
            Mi Biblioteca
          </Text>

          <TouchableOpacity onPress={toggleSearch} className="rounded-full p-3">
            {isSearchVisible ? (
              <CancelIcon2 size={24} color={colors.primaryText} />
            ) : (
              <SearchIcon2 size={24} color={colors.primaryText} />
            )}
          </TouchableOpacity>
        </View>

        {isSearchVisible && (
          <Animated.View 
            entering={FadeInUp.duration(300).springify()} 
            style={{ zIndex: 1 }}
          >
            <SearchBar />
          </Animated.View>
        )}

        <Animated.View layout={LinearTransition.springify()} style={{ flex: 1 }}>
          <TabView
            navigationState={{ index: safeIndex, routes }}
            renderScene={renderScene}
            renderTabBar={(props) => <CategoryTabBar {...props} />}
            onIndexChange={handleIndexChange}
            initialLayout={{ width: layout.width }}
            lazy
            swipeEnabled={true}
          />
        </Animated.View>
      </View>
    </Screen>
  );
}