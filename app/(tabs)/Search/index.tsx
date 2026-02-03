import { View, Text, FlatList } from 'react-native';
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
  const { busqueda, setBusqueda, resultados, loading, handleSearch } = useSearchUser();
  const { colors } = useTheme();
  return (
    <Screen>
      <ThemedStatusBar/>
      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 text-3xl font-bold" style={{ color: colors.primaryText }}>Usuarios</Text>
        <UserSearchBar value={busqueda} onChangeText={setBusqueda} onSearch={handleSearch} />

        {resultados.length > 0 ? (
          <FlatList
            className={`-z-10 flex-1 ${loading ? 'hidden' : ''}`}
            data={resultados}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
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
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
          />
        ) : (
          <UserSearchPlaceholder loading={loading} />
        )}

        {loading && (
          <LoadingIndicator />
        )}
      </View>
    </Screen>
  );
}
