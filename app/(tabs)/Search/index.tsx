import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { useSearchContent } from 'src/Add/hooks/useSearchContent';

import { SearchBar } from 'src/Add/components/SearchBar';
import { SearchResultItem } from 'src/Add/components/SearchResultItem';
import { SearchPlaceholder } from 'src/Add/components/SearchPlaceholder';
import { COLORS } from 'constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SearchScreen() {
  const {
    busqueda,
    setBusqueda,
    recursoBusqueda,
    setRecursoBusqueda,
    menuAbierto,
    setMenuAbierto,
    loading,
    resultados,
    handleSearch,
    navigateToDetails,
    setResultados,
  } = useSearchContent();

  return (
    <Screen>
      <StatusBar style="light" />
      <View className="flex-1 px-4 pt-6">
        <Text className="text-3xl font-bold text-primaryText">Usuarios</Text>

        <View className={`-z-10 flex-1 items-center justify-center ${loading ? 'hidden' : ''}`}>
          {/* Contenedor del Icono  */}
          <View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-white/5">
            <View className="h-28 w-28 items-center justify-center rounded-full bg-primary">
              <MaterialCommunityIcons name={'hammer-wrench'} size={64} color="#fff" />
            </View>
          </View>

          {/* Texto Principal (Nombre de la categoría) */}
          <Text className="mb-3 text-center text-3xl font-bold text-primaryText">Usuarios</Text>

          {/* Texto Secundario (Instrucciones) */}
          <Text className="px-4 text-center text-secondaryText">
            En construcción.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
