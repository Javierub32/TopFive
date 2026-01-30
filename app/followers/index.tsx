import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Text, TouchableOpacity, View, ScrollView } from 'react-native';

import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import FollowersList from '@/Followers/components/FollowersList';
import FollowingList from '@/Followers/components/FollowingList';

type TabType = 'followers' | 'following';

const { width } = Dimensions.get('window');

export default function FollowersScreen() {
  const {username, page} = useLocalSearchParams<{ username?: string; page?: string }>();
  const [activeTab, setActiveTab] = useState<TabType>(page as TabType || 'followers' );
  const [visitedTabs, setVisitedTabs] = useState<Set<TabType>>(new Set([page as TabType || 'followers']));
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Sincronizar posición inicial del ScrollView
  useEffect(() => {
    const initialTab = (page as TabType) || 'followers';
    const xOffset = initialTab === 'following' ? width : 0;
    
    // Usar setTimeout para asegurar que el ScrollView esté renderizado
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: xOffset, animated: false });
    }, 0);
  }, []);
  
  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    setVisitedTabs((prev) => new Set(prev).add(tab));
    const xOffset = tab === 'followers' ? 0 : width;
    scrollViewRef.current?.scrollTo({ x: xOffset, animated: true });
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newTab: TabType = offsetX < width / 2 ? 'followers' : 'following';
        setActiveTab(newTab);
        
        // Marcar la pestaña como visitada
        setVisitedTabs((prev) => new Set(prev).add(newTab));
      },
    }
  );

  // Calcular posición y ancho de la barra indicadora
  const indicatorWidth = width / 2;
  const indicatorTranslate = scrollX.interpolate({
    inputRange: [0, width],
    outputRange: [0, indicatorWidth],
    extrapolate: 'clamp',
  });
  console.log('activateTab:', activeTab);
  console.log('visitedTabs:', Array.from(visitedTabs));
  
  
  return (
    <Screen>
      <ReturnButton route='/(tabs)/Profile' title={username || ''} />
      
      {/* Tabs Header */}
      <View className="flex-row border-b border-borderButton">
        <TouchableOpacity
          className="flex-1 items-center py-3"
          onPress={() => handleTabPress('followers')}
          activeOpacity={0.7}>
          <Text
            className={`text-base font-semibold ${
              activeTab === 'followers' ? 'text-primaryText' : 'text-secondaryText'
            }`}>
            Seguidores
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center py-3"
          onPress={() => handleTabPress('following')}
          activeOpacity={0.7}>
          <Text
            className={`text-base font-semibold ${
              activeTab === 'following' ? 'text-primaryText' : 'text-secondaryText'
            }`}>
            Seguidos
          </Text>
        </TouchableOpacity>

        {/* Barra indicadora animada */}
        <Animated.View
          className="absolute bottom-0 h-0.5 bg-primaryText"
          style={{
            width: indicatorWidth,
            transform: [{ translateX: indicatorTranslate }],
          }}
        />
      </View>

      {/* Content */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={20}>
        {/* followers */}
        <View style={{ width }}>
          {visitedTabs.has('followers') ? (
            <FollowersList />
          ) : (
            <View style={{ width }} />
          )}
        </View>

        {/* Seguidos */}
        <View style={{ width }}>
          {visitedTabs.has('following') ? (
			<FollowingList />
          ) : (
            <View style={{ width }} />
          )}
        </View>
      </Animated.ScrollView>
    </Screen>
  );
}