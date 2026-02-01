import { useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIcon, CardsIcon, UserIcon, SearchIcon, AddIcon } from 'components/Icons';
import { COLORS } from 'constants/colors';
import { AddModal } from '../../src/Add/components/AddModal';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <AddModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelect={(type) => {
          router.push({
            pathname: 'Add/',
            params: { initialCategory: type }
          });
        }}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.tabBarActiveTintColor,
          tabBarInactiveTintColor: COLORS.tabBarInactiveTintColor,
          tabBarShowLabel: false,
          headerTintColor: '#fff',
          tabBarStyle: {
            backgroundColor: COLORS.tabBarBackgroundColor,
            borderTopColor: COLORS.tabBarBorderTopColor,
            borderTopWidth: 2,
            height: 52 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}>
      <Tabs.Screen
        name="Home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="Search/index"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <SearchIcon color={color} size={26} />,
        }}
      />
      <Tabs.Screen
        name="Add/index"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size }) => <AddIcon color={color} size={26} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            setShowAddModal(true);
          },
        }}
      />
      <Tabs.Screen
        name="Collection/index"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color, size }) => <CardsIcon color={color} size={26} />,
        }}
      />
      <Tabs.Screen
        name="Profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <UserIcon color={color} size={26} />,
        }}
      />
    </Tabs>
    </>
  );
}
