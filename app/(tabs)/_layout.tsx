import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIcon, CardsIcon, UserIcon, SearchIcon } from 'components/Icons';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
		headerShown: false,
        tabBarActiveTintColor: '#8b5cf6',
        tabBarInactiveTintColor: '#9ca3af',

        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#1e1e2e',
          borderTopColor: 'rgba(139, 92, 246, 0.3)',
          borderTopWidth: 2,
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => (<HomeIcon color={color} size={size} />),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({color, size}) => (<SearchIcon color={color} size={size} />),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Cards',
          tabBarIcon: ({color, size}) => (<CardsIcon color={color} size={size} />),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({color, size}) => (<UserIcon color={color} size={size} />),
        }}
      />
    </Tabs>
  );
}
