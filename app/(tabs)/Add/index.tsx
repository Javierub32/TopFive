import { View, Text, FlatList } from 'react-native';
import { Screen } from 'components/Screen';
import { useSearchContent } from 'src/Add/hooks/useSearchContent';

import { SearchBar } from 'src/Add/components/SearchBar';
import { SearchResultItem } from 'src/Add/components/SearchResultItem';
import { FoundPlaceholder } from 'src/Add/components/FoundPlaceholder';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { SearchPlaceholder } from '@/Add/components/SearchPlaceholder';

export default function AddScreen() {
  const {
    busqueda,
    setBusqueda,
    recursoBusqueda,
    setRecursoBusqueda,
    menuAbierto,
    setMenuAbierto,
    hasSearched,
    loading,
    resultados,
    handleSearch,
    navigateToDetails,
  } = useSearchContent();

  const { colors } = useTheme();

  return (
    <Screen>
      <ThemedStatusBar />
      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 mt-2 text-3xl font-bold" style={{ color: colors.primaryText }}>
          Búsqueda
        </Text>

        <SearchBar
          value={busqueda}
          onChangeText={setBusqueda}
          onSearch={handleSearch}
          selectedCategory={recursoBusqueda}
          onCategoryChange={(cat) => {
            setRecursoBusqueda(cat);
          }}
          menuAbierto={menuAbierto}
          setMenuAbierto={setMenuAbierto}
        />
        {resultados.length > 0 ? (
          <FlatList
            className={`-z-10 flex-1 ${loading ? 'hidden' : ''}`}
            data={resultados}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <SearchResultItem
                item={item}
                type={recursoBusqueda}
                onPress={() => navigateToDetails(index)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
          />
        ) : hasSearched ? (
          <FoundPlaceholder category={recursoBusqueda} loading={loading} />
        ) : (
          <SearchPlaceholder category={recursoBusqueda} loading={loading} />
        )}

        {loading && <LoadingIndicator />}
      </View>
    </Screen>
  );
}
