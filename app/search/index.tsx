import { View, FlatList, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Screen } from 'components/Screen';
import { UserSearchBar } from '@/Search/components/UserSearchBar';
import { useSearchUser } from '@/Search/hooks/useSearchUser';
import { UserSearchPlaceholder } from '@/Search/components/UserSearchPlaceholder';
import { UserResultItem } from '@/Search/components/UserResultItem';
import { router } from 'expo-router';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { ReturnButton } from 'components/ReturnButton';
import { useTranslation } from 'react-i18next';
import { RecentUserSearch } from '@/Search/services/recentSearchStorage';
import { ScalableMaterialCommunityIcons } from 'components/Icons';
import { AppText } from 'components/AppText';
import { useTheme } from 'context/ThemeContext';

export default function SearchhScreen() {
  const { busqueda, 
	setBusqueda,
	resultados, 
	loading, 
	handleSearch, 
	handleLoadMore, 
	activeSearch, 
	recentSearches,
	addRecentSearch,
	deleteRecentSearch,
	loadingRecentUsers } =
    useSearchUser();
  const { t } = useTranslation();

  const { colors } = useTheme();

  const showRecentSearches =  !activeSearch.trim() && recentSearches.length > 0;

  const openUser = async (item: RecentUserSearch) => {
	await addRecentSearch({
		id: item.id,
		username: item.username,
		description: item.description,
		avatar_url: item.avatar_url,
		createdAt: Date.now(),
	});

	router.push({
		pathname: 'details/user/',
		params: { username: item.username },
	});
};
  // Loading inicial de la búsqueda o del historial local
  if ((loading || loadingRecentUsers) && resultados.length === 0) {
    return (
      <Screen>
        <ThemedStatusBar />

        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <View className="flex-1 px-4 pt-6">
            <ReturnButton
              route="back"
              title={t('search.usersTitle')}
              style="mb-8"
            />

            <UserSearchBar
              value={busqueda}
              onChangeText={setBusqueda}
              onSearch={handleSearch}
            />

            <View className="flex-1 items-center justify-center">
              <LoadingIndicator />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedStatusBar />

      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View className="flex-1 px-4 pt-6">
          <ReturnButton
            route="back"
            title={t('search.usersTitle')}
            style="mb-6"
            deleteSearchResults={true}
          />

          <UserSearchBar
            value={busqueda}
            onChangeText={setBusqueda}
            onSearch={handleSearch}
          />

          {showRecentSearches ? (
            <View className="flex-1">
              <AppText
                className="mb-2 mt-6 font-bold"
                style={{
                  color: colors.primaryText,
                  fontSize: 20,
                }}
              >
                {t('searchRecent.recentSearches')}
              </AppText>

              <FlatList
                data={recentSearches}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item }) => (
                  <View className="flex-row items-center">
                    <View className="flex-1">
                      <UserResultItem
                        item={item}
                        onPress={() => openUser(item)}
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
                      accessibilityLabel={t('searchRecent.deleteRecentSearch', {username: item.username,})}
                    >
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
              className="-z-10 flex-1"
              data={resultados}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <UserResultItem
                  item={item}
                  onPress={() => openUser(item)}
                />
              )}
              onEndReachedThreshold={0.5}
              onEndReached={handleLoadMore}
              contentContainerStyle={{
                paddingBottom: 40,
                paddingTop: 10,
              }}
              ListFooterComponent={() =>
                loading ? <LoadingIndicator /> : null
              }
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <UserSearchPlaceholder loading={loading} />
          )}
        </View>
      </TouchableWithoutFeedback>
    </Screen>
  );
}
