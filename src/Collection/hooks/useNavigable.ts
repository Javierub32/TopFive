import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useWindowDimensions, View, Text } from "react-native";
import { TabBar, TabBarProps } from "react-native-tab-view";

export const useNavigable = () => {
  const layout = useWindowDimensions();
  const { page } = useLocalSearchParams<{ username?: string; page?: string }>();

  const [index, setIndex] = useState(page === 'lists' ? 1 : 0);
  const [routes] = useState([
	{ key: 'resources', title: 'Recursos' },
	{ key: 'lists', title: 'Listas' },
  ]);

  return {
    layout,
    index,
    setIndex,
    routes,
  };
};