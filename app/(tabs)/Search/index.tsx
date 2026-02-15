import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { UserSearchBar } from '@/Search/components/UserSearchBar';
import { useSearchUser } from '@/Search/hooks/useSearchUser';
import { UserSearchPlaceholder } from '@/Search/components/UserSearchPlaceholder';
import { UserResultItem } from '@/Search/components/UserResultItem';
import { router } from 'expo-router';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';

export default function SearchScreen() {
  const { busqueda, setBusqueda, resultados, loading, handleSearch, handleLoadMore } = useSearchUser();
  const { colors } = useTheme();

  // Loading inicial (pantalla completa solo si es la primera búsqueda)
  if (loading && resultados.length === 0) {
    return (
      <Screen>
        <ThemedStatusBar />
        <View className="flex-1 px-4 pt-6">
            <Text className="mb-4 text-3xl font-bold" style={{ color: colors.primaryText }}>Usuarios</Text>
            <UserSearchBar value={busqueda} onChangeText={setBusqueda} onSearch={handleSearch} />
            <View className="flex-1 justify-center items-center">
                 <LoadingIndicator />
            </View>
        </View>
      </Screen>
    );
  }
  
  return (
    <Screen>
      <ThemedStatusBar/>
      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 text-3xl font-bold" style={{ color: colors.primaryText }}>Usuarios</Text>
        
        <UserSearchBar 
            value={busqueda} 
            onChangeText={setBusqueda} 
            onSearch={handleSearch} 
        />

        {resultados.length > 0 ? (
          <FlatList
            className="-z-10 flex-1" // Quitamos la clase 'hidden' condicional
            data={resultados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <UserResultItem
                item={item}
                onPress={() =>
                  router.push({
                    pathname: 'details/user/',
                    params: { username: item.username },
                  })
                }
              />
            )}
            // Umbral para cargar más antes de llegar al final
            onEndReachedThreshold={0.5} 
            onEndReached={handleLoadMore}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
            // Loader inferior pequeño para paginación
            ListFooterComponent={() => 
                loading ? <LoadingIndicator /> : null
            }
			showsVerticalScrollIndicator={false}
          />
        ) : (
          <UserSearchPlaceholder loading={loading} />
        )}
      </View>
    </Screen>
  );
}
