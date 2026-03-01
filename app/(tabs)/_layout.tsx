import { useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIcon, CardsIcon, UserIcon, SearchIcon, AddIcon, ListIcon } from 'components/Icons';
import { CategorySelectorModal } from 'components/CategorySelectorModal';
import { useTheme } from 'context/ThemeContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);

  const { colors } = useTheme();

  return (
    <>
      <CategorySelectorModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelectCategory={(type) => {
          router.push({
            pathname: 'Add/',
            params: { initialCategory: type }
          });
        }}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.tabBarActiveTintColor,
          tabBarInactiveTintColor: colors.tabBarInactiveTintColor,
          tabBarShowLabel: false,
          headerTintColor: colors.primaryText,
          tabBarStyle: {
            backgroundColor: colors.tabBarBackgroundColor,
            borderTopWidth: 0,
            height: 52 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 10,
            shadowColor: colors.backgroundColor,
            shadowRadius: 20,
            shadowOpacity: 0.75,
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
        name="Lists/index"
        options={{
          title: 'List',
          tabBarIcon: ({ color, size }) => <ListIcon color={color} size={30} />,
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
