import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { COLORS } from 'constants/colors';
import { UserSearchBar } from '@/Search/components/UserSearchBar';
import { useSearchUser } from '@/Search/hooks/useSearchUser';
import { UserSearchPlaceholder } from '@/Search/components/UserSearchPlaceholder';
import { UserResultItem } from '@/Search/components/UserResultItem';
import { router } from 'expo-router';

export default function SearchScreen() {
  const { busqueda, setBusqueda, resultados, loading, handleSearch } = useSearchUser();
  return (
    <Screen>
      <StatusBar style="light" />
      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 text-3xl font-bold text-primaryText">Usuarios</Text>
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
                    params: { id: item.id },
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
          <View className="absolute inset-0 z-50 items-center justify-center bg-black/50">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      </View>
    </Screen>
  );
}
