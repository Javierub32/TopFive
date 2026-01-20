import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { useSearchContent } from 'src/Search/hooks/useSearchContent';

import { SearchBar } from 'src/Search/components/SearchBar';
import { SearchResultItem } from 'src/Search/components/SearchResultItem';
import { SearchPlaceholder } from 'src/Search/components/SearchPlaceholder';
import { COLORS } from 'constants/colors';

export default function SearchScreen() {
  const {
    busqueda, setBusqueda,
    recursoBusqueda, setRecursoBusqueda,
    menuAbierto, setMenuAbierto,
    loading, resultados,
    handleSearch, navigateToDetails,
    setResultados
  } = useSearchContent();

  return (
    <Screen>
      <StatusBar style="light" />
      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 text-3xl font-bold text-primaryText">Búsqueda</Text>

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
          />
        ) : (
          <SearchPlaceholder category={recursoBusqueda} loading={loading} />
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