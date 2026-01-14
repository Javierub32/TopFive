import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBar } from '@react-navigation/bottom-tabs'; // Importación necesaria

import { HomeIcon, CardsIcon, UserIcon, SearchIcon } from 'components/Icons';
import { COLORS } from 'constants/colors';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      tabBar={(props) => (
        <BottomTabBar 
          {...props} 
          state={{
            ...props.state,
            routes: props.state.routes.filter((route) => !route.name.includes('components')),
          }} 
        />
      )}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.tabBarActiveTintColor,
        tabBarInactiveTintColor: COLORS.tabBarInactiveTintColor,
        tabBarShowLabel: true, 
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: COLORS.tabBarBackgroundColor,
          borderTopColor: COLORS.tabBarBorderTopColor,
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
        name="Home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => (<HomeIcon color={color} size={size} />),
        }}
      />
      <Tabs.Screen
        name="Search/index"
        options={{
          title: 'Search',
          tabBarIcon: ({color, size}) => (<SearchIcon color={color} size={size} />),
        }}
      />
      <Tabs.Screen
        name="Collection/index"
        options={{
          title: 'Collection',
          tabBarIcon: ({color, size}) => (<CardsIcon color={color} size={size} />),
        }}
      />
      <Tabs.Screen
        name="Profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({color, size}) => (<UserIcon color={color} size={size} />),
        }}
      />
    </Tabs>
  );
}