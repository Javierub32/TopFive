import { View, FlatList, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Screen } from 'components/Screen';
import { useSearchContent } from 'src/Add/hooks/useSearchContent';

import { SearchBar } from 'src/Add/components/SearchBar';
import { SearchResultItem } from 'src/Add/components/SearchResultItem';
import { FoundPlaceholder } from 'src/Add/components/FoundPlaceholder';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ScalableMaterialCommunityIcons } from 'components/Icons';
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
    openContent,
    openRecentContent,
    recentSearches,
    loadingRecentContent,
    deleteRecentSearch,
  } = useSearchContent();

  const { colors } = useTheme();
  const { t } = useTranslation();

  const showRecentContent = !busqueda.trim() && !hasSearched && recentSearches.length > 0;

  const showRecentLoading = loadingRecentContent && !busqueda.trim() && !hasSearched;

  return (
    <Screen>
      <ThemedStatusBar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 px-4 pt-6">
          <AppText
            className="mb-4 mt-2 font-bold"
            style={{ fontSize: 28, color: colors.primaryText }}>
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
          {showRecentLoading ? (
            <View className="flex-1 items-center justify-center">
              <LoadingIndicator />
            </View>
          ) : showRecentContent ? (
            <View className="flex-1">
              <AppText
                className="mb-2 mt-6 font-bold"
                style={{
                  color: colors.primaryText,
                  fontSize: 20,
                }}>
                {t('searchRecent.recentSearches')}
              </AppText>

              <FlatList
                data={recentSearches}
                keyExtractor={(item) => `${item.category}-${item.id}`}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item }) => (
                  <View className="flex-row items-center">
                    <View className="flex-1">
                      <SearchResultItem
                        item={{
                          id: item.id,
                          title: item.title || item.term,
                          artist: '',
                          cover: item.cover || '',
                          genre: '',
                          date: '',
                          rating: '',
                        }}
                        type={item.category}
                        showArrow={false}
                        onPress={() => openRecentContent(item)}
                      />
                    </View>

                    <TouchableOpacity
                      className="px-2"
                      onPress={() => deleteRecentSearch(item)}
                      hitSlop={{
                        top: 12,
                        bottom: 12,
                        left: 12,
                        right: 12,
                      }}
                      accessibilityLabel={t('searchRecent.deleteRecentContent', {
                        title: item.title || item.term,
                      })}>
                      <ScalableMaterialCommunityIcons
                        name="close"
                        size={24}
                        color={colors.secondaryText}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          ) : resultados.length > 0 ? (
            <FlatList
              className={`-z-10 flex-1 ${loading ? 'hidden' : ''}`}
              data={resultados}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <SearchResultItem
                  item={item}
                  type={recursoBusqueda}
                  onPress={() => openContent(item)}
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
      </TouchableWithoutFeedback>
    </Screen>
  );
}
