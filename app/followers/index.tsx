import React, { useState } from 'react';
import { useWindowDimensions, Text, View } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useLocalSearchParams } from 'expo-router/build/hooks';

import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import FollowersList from '@/Followers/components/FollowersList';
import FollowingList from '@/Followers/components/FollowingList';
import { useTheme } from 'context/ThemeContext';

// Definimos las escenas (componentes a renderizar)
const renderScene = SceneMap({
  followers: FollowersList,
  following: FollowingList,
});

export default function FollowersScreen() {
  const layout = useWindowDimensions();
  const { username, page } = useLocalSearchParams<{ username?: string; page?: string }>();
  const { colors } = useTheme();

  // Índice: 0 para followers, 1 para following
  const [index, setIndex] = useState(page === 'following' ? 1 : 0);
  
  const [routes] = useState([
    { key: 'followers', title: 'Seguidores' },
    { key: 'following', title: 'Seguidos' },
  ]);

  // Personalización de la barra superior
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      activeColor={colors.primaryText} // O usa tu color primaryText
      inactiveColor={colors.placeholderText}// O usa tu color secondaryText
      indicatorStyle={{ backgroundColor: colors.secondaryText, height: 2 }} // La barra animada
      style={{ backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}
      renderLabel={({ route, focused }: any) => (
        <Text className={`text-base font-semibold ${focused ? 'text-primaryText' : 'text-secondaryText'}`}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <Screen>
      <ReturnButton route='/(tabs)/Profile' title={username || ''} />
      
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