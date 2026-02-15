import { View, Text, FlatList } from 'react-native';
import { Screen } from 'components/Screen';
import { useSearchContent } from 'src/Add/hooks/useSearchContent';

import { SearchBar } from 'src/Add/components/SearchBar';
import { SearchResultItem } from 'src/Add/components/SearchResultItem';
import { SearchPlaceholder } from 'src/Add/components/SearchPlaceholder';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';

export default function AddScreen() {
  const {
    busqueda, setBusqueda,
    recursoBusqueda, setRecursoBusqueda,
    menuAbierto, setMenuAbierto,
    loading, resultados,
    handleSearch, navigateToDetails,
    setResultados
  } = useSearchContent();

  const { colors } = useTheme();

  return (
    <Screen>
      <ThemedStatusBar/>
      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 text-3xl font-bold" style={{color: colors.primaryText}}>Búsqueda</Text>

        <SearchBar 
          value={busqueda}
          onChangeText={setBusqueda}
          onSearch={handleSearch}
          selectedCategory={recursoBusqueda}
          onCategoryChange={(cat) => {
            setRecursoBusqueda(cat);
            setResultados([]);
          }}
          menuAbierto={menuAbierto}
          setMenuAbierto={setMenuAbierto}
        />

        {resultados.length > 0 ? (
          <FlatList
            className={`flex-1 -z-10 ${loading ? 'hidden' : ''}`}
            data={resultados}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <SearchResultItem 
                item={item} 
                onPress={() => navigateToDetails(index)} 
              />
            )}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
			showsVerticalScrollIndicator={false}
          />
        ) : (
          <SearchPlaceholder category={recursoBusqueda} loading={loading} />
        )}

        {loading && (
          <LoadingIndicator />
        )}
      </View>
    </Screen>
  );
}