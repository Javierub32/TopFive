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

export default function ListScreen() {
  const { colors } = useTheme();
  const layout = useWindowDimensions();
  const { categoriaActual, setCategoriaActual } = useCollection();
  const [isChanging, setIsChanging] = useState(false);
  const [tabBarWidth, setTabBarWidth] = useState(0);

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

  const renderTabBar = (props: any) => {
    const tabCount = props.navigationState.routes.length;
    
    // Calculamos el ancho de cada pestaña en píxeles
    // El -8 es para compensar el padding (p-1 = 4px por lado) del contenedor
    const availableWidth = tabBarWidth - 8;
    const tabWidth = availableWidth / tabCount;

    // Interpolación usando PÍXELES (obligatorio para Android)
    const translateX = props.position.interpolate({
      inputRange: props.navigationState.routes.map((_: any, i: number) => i),
      outputRange: props.navigationState.routes.map((_: any, i: number) => i * tabWidth),
    });

    return (
      <View className="py-2 bg-transparent mb-2">
        <View 
          className="rounded-lg border border-borderButton bg-surfaceButton p-1 shadow-lg"
          onLayout={(e: LayoutChangeEvent) => setTabBarWidth(e.nativeEvent.layout.width)}
        >
          <View className="flex-row relative h-10">
            
            {/* --- FONDO ANIMADO (PASTILLA AZUL) --- */}
            {tabBarWidth > 0 && (
              <Animated.View 
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: tabWidth, 
                  backgroundColor: colors.secondary,
                  borderRadius: 6,
                  transform: [{ translateX }] 
                }} 
              />
            )}

            {/* --- ICONOS (FRENTE) --- */}
            {props.navigationState.routes.map((route: any, i: number) => {
              const isActive = props.navigationState.index === i;
              const iconColor = isActive ? 'white' : '#94a3b8';
              const iconProps = { size: 24, color: iconColor }; 
              
              let IconComponent = null;
              switch (route.key) {
                case 'libro': IconComponent = <BookIcon {...iconProps} />; break;
                case 'pelicula': IconComponent = <FilmIcon {...iconProps} />; break;
                case 'serie': IconComponent = <ShowIcon {...iconProps} />; break;
                case 'videojuego': IconComponent = <GameIcon {...iconProps} />; break;
                case 'cancion': IconComponent = <MusicIcon {...iconProps} />; break;
              }

              return (
                <TouchableOpacity
                  key={route.key}
                  activeOpacity={0.7}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}
                  onPress={() => props.jumpTo(route.key)}
                >
                  {IconComponent}
                </TouchableOpacity>
              );
            })}

          </View>
        </View>
      </View>
    );
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
      <FlatList
        data={lists}
        keyExtractor={(list) => list.id.toString()}
        renderItem={({ item: list }) => (
          <ListItem list={list} onDelete={deleteList} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 4 }}
        ListEmptyComponent={
          <View className="items-center justify-center mt-10 px-4">
            <Text className="text-center italic" style={{ color: colors.secondaryText }}>
              No tienes listas de {route.nombre.toLowerCase()}.
            </Text>
          </View>
        }
      />
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
          renderTabBar={renderTabBar}
          onIndexChange={handleIndexChange}
          initialLayout={{ width: layout.width }}
          swipeEnabled={true} 
          style={{ flex: 1 }}
        />
        
      </View>
    </Screen>
  );
}