import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Screen } from 'components/Screen';
import { useTheme } from 'context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ListItem } from './ListItem';
import { router } from 'expo-router';
import { useLists } from '../hooks/useLists';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useCollection } from 'context/CollectionContext';
import { ResourceType } from 'hooks/useResource';

// Datos de prueba para simular el backend
const MOCK_LISTS = [
  {
    id: 1,
    title: "Favoritas de todos los tiempos",
    count: 24,
    icon: "heart",
    iconColor: "#ef4444", // Rojo
    iconBg: "#fee2e2", // Rojo muy claro
    // Imágenes de prueba (formato póster 2:3)
    images: [
      "https://picsum.photos/200/300?random=1",
      "https://picsum.photos/200/300?random=2",
      "https://picsum.photos/200/300?random=3",
      "https://picsum.photos/200/300?random=4",
      "https://picsum.photos/200/300?random=5", 
      // ... más imágenes implícitas
    ]
  },
  {
    id: 2,
    title: "Para ver en Halloween",
    count: 12,
    icon: "ghost",
    iconColor: "#a855f7", // Morado
    iconBg: "#f3e8ff", 
    images: [
      "https://picsum.photos/200/300?random=11",
      "https://picsum.photos/200/300?random=12",
      "https://picsum.photos/200/300?random=13",
    ]
  },
  {
    id: 3,
    title: "Maratón de fin de semana",
    count: 5,
    icon: "popcorn",
    iconColor: "#f59e0b", // Ámbar
    iconBg: "#fef3c7",
    images: [
      "https://picsum.photos/200/300?random=21",
      "https://picsum.photos/200/300?random=22",
    ]
  }
];

export default function Lists() {
  const { colors } = useTheme();
  const { categoriaActual } = useCollection();
  const { lists, loading, deleteList } = useLists(categoriaActual as ResourceType);

  return (
      <View className="flex-1  mt-4" >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold" style={{ color: colors.primaryText }}>
            Mis Listas
          </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/form/list")}>
            <Text className="text-base font-semibold" style={{ color: colors.primary }}>
              + Nueva lista
            </Text>
          </TouchableOpacity>
        </View>
        { loading ? <LoadingIndicator /> : (
		<FlatList
			data={lists}
			keyExtractor={(list) => list.id.toString()}
			renderItem={({ item: list }) => (
				<ListItem list={list} onDelete={deleteList} />
			)}
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 100 }}
		/>
	)}

      </View>
  );
}