import { View, FlatList } from 'react-native';
import { Screen } from 'components/Screen';
import { useSearchContent } from 'src/Add/hooks/useSearchContent';

import { SearchBar } from 'src/Add/components/SearchBar';
import { SearchResultItem } from 'src/Add/components/SearchResultItem';
import { FoundPlaceholder } from 'src/Add/components/FoundPlaceholder';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { SearchPlaceholder } from '@/Add/components/SearchPlaceholder';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Screen>
      <ThemedStatusBar />
      <View className="flex-1 px-4 pt-6">
        <AppText className="mb-4 mt-2 font-bold" style={{ fontSize: 28, color: colors.primaryText }}>
          {t('tabs.search')}
        </AppText>

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
