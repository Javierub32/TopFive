import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useLocalSearchParams } from 'expo-router/build/hooks';

import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import FollowersList from '@/Followers/components/FollowersList';
import FollowingList from '@/Followers/components/FollowingList';
import { useTheme } from 'context/ThemeContext';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

// Definimos las escenas (componentes a renderizar)
const renderScene = SceneMap({
  followers: FollowersList,
  following: FollowingList,
});

export default function FollowersScreen() {
  const layout = useWindowDimensions();
  const { username, page } = useLocalSearchParams<{ username?: string; page?: string }>();
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Índice: 0 para followers, 1 para following
  const [index, setIndex] = useState(page === 'following' ? 1 : 0);

  const [routes] = useState([
    { key: 'followers', title: t('profile.followers') },
    { key: 'following', title: t('profile.following') },
  ]);

  // Personalización de la barra superior
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      activeColor={colors.primaryText} // O usa tu color primaryText
      inactiveColor={colors.placeholderText} // O usa tu color secondaryText
      indicatorStyle={{ backgroundColor: colors.secondaryText, height: 2 }} // La barra animada
      style={{
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      }}
      renderLabel={({ route, focused }: any) => (
        <AppText
          className={`text-base font-semibold ${focused ? 'text-primaryText' : 'text-secondaryText'}`}>
          {route.title}
        </AppText>
      )}
    />
  );

  return (
    <Screen>
      <ReturnButton route="/(tabs)/Profile" title={username || ''} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy // Esto reemplaza tu lógica de "visitedTabs" automáticamente
      />
    </Screen>
  );
}
