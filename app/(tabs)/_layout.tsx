import { useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScalableHomeIcon, ScalableCardsIcon, ScalableUserIcon, ScalableSearchIcon, AddIcon, ScalableListIcon } from 'components/Icons';
import { CategorySelectorModal } from 'components/CategorySelectorModal';
import { useTheme } from 'context/ThemeContext';
import { useSearch } from 'context/SearchContext';
import { Image, useWindowDimensions, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useAuth } from "context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/query/queryKeys";
import { supabase } from "lib/supabase";
import { userService } from "@/Profile/services/profileService";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const { clearContentSearch } = useSearch();

  const { colors } = useTheme();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: queryKeys.profile(user?.id),
    queryFn: () => userService.fetchUserProfile(user!.id),
    enabled: !!user?.id,
  })

  const {width} = useWindowDimensions();
  const tabBarHeight = 52 + insets.bottom;

  const centerX = width /2;
  const notchHalfWidth = 52;
  const notchDepth = 44;

  const notchPath = [
  'M 0 0',
  `H ${centerX - notchHalfWidth}`,
  `C ${centerX - notchHalfWidth + 18} 0`,
  `${centerX - notchHalfWidth + 18} ${notchDepth}`,
  `${centerX} ${notchDepth}`,
  `C ${centerX + notchHalfWidth - 18} ${notchDepth}`,
  `${centerX + notchHalfWidth - 18} 0`,
  `${centerX + notchHalfWidth} 0`,
  `H ${width} V ${tabBarHeight} H 0 Z`,
].join(' ');

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
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            height: tabBarHeight,
            paddingBottom: insets.bottom,
            paddingTop: 10,
            shadowOpacity: 0,
            elevation: 0,
          },
          tabBarBackground: () => (
            <Svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${width} ${tabBarHeight}`}
              preserveAspectRatio="none">
              <Path d={notchPath} fill={colors.tabBarBackgroundColor} />
            </Svg>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}>
      <Tabs.Screen
        name="Home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <ScalableHomeIcon color={color} size={28} />,
        }}
		listeners={{ tabPress: () => clearContentSearch() }}
      />
      <Tabs.Screen
        name="Lists/index"
        options={{
          title: 'List',
          tabBarIcon: ({ color, size }) => <ScalableListIcon color={color} size={30} />,
        }}
		listeners={{ tabPress: () => clearContentSearch() }}
      />
        <Tabs.Screen
          name="Add/index"
          options={{
            title: 'Add',
            tabBarIcon: ({ color, size }) => (
              <View
                style={{
                  padding: 6,
                  borderRadius: 100,
                  transform: [{ translateY: -20 }],
                  width: 72,
                  height: 72,
                }}>
                <View
                  style={{
                    backgroundColor: colors.accent,
                    padding: 12,
                    borderRadius: 100,
                    
                  }}>
                  <AddIcon
                    color={colors.background}
                    size={28}
                    style={{ padding: 4 }}
                  />
                </View>
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              clearContentSearch();
              setShowAddModal(true);
            },
          }}
        />
      
      <Tabs.Screen
        name="Collection/index"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color, size }) => <ScalableCardsIcon color={color} size={26} />,
        }}
		listeners={{ tabPress: () => clearContentSearch() }}
      />
      <Tabs.Screen
        name="Profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => profile?.avatar_url ? (
            <View style={{padding: 2, borderRadius: 20, backgroundColor: color}}>
              <Image source={{uri: profile.avatar_url}}
              style={{width: 26, height: 26, borderRadius: 13}}
              resizeMode="cover"/>
            </View>
            
          ) : <ScalableUserIcon color={color} size={26} />,
        }}
		listeners={{ tabPress: () => clearContentSearch() }}
      />
    </Tabs>
    </>
  );
}
