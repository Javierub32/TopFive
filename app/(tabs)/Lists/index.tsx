import { useState } from 'react';
import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Screen } from 'components/Screen';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { useCollection } from 'context/CollectionContext';
import { useLists } from '@/Collection/hooks/useLists';
import { ResourceType } from 'hooks/useResource';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { router } from 'expo-router';
import { TabView } from 'react-native-tab-view';
import { CategoryTabBar } from 'components/CategoryTarBar';
import Lists from '@/Collection/components/Lists';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

export default function ListScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const { categoriaActual, setCategoriaActual } = useCollection();
  const [isChanging, setIsChanging] = useState(false);
  const { lists, loading, deleteList, handleLoadMore } = useLists(categoriaActual as ResourceType);

  const [routes] = useState([
    { key: 'libro', nombre: t('categories.books') },
    { key: 'serie', nombre: t('categories.series') },
    { key: 'pelicula', nombre: t('categories.films') },
    { key: 'videojuego', nombre: t('categories.videogames') },
    { key: 'cancion', nombre: t('categories.albums') },
  ]);

  const index = routes.findIndex((r) => r.key === categoriaActual);
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
    if (isChanging || route.key !== categoriaActual || (loading && lists.length === 0)) {
      return (
        <View
          className="mt-10 flex-1 items-center justify-center"
          style={{ backgroundColor: colors.background }}>
          <LoadingIndicator />
        </View>
      );
    }

    return <Lists 
      data={lists} 
      placeholder={route.nombre.toLowerCase()} 
      deleteList={deleteList} 
      onLoadMore={handleLoadMore}
      loading={loading}
    />;
  };

  return (
    <Screen>
      <ThemedStatusBar />
      <View className="flex-1 px-4 pt-6">
        <View className="mb-4 mt-2 flex-row items-end justify-between">
          <AppText className=" font-bold" style={{ color: colors.primaryText, fontSize: 28 }}>
            {t('tabs.lists')}
          </AppText>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/form/list')}>
            <AppText  style={{ color: colors.primary, fontSize: 14 }}>
              {t('list.createNewList')}
            </AppText>
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
