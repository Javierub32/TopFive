// app/frameSelector/index.tsx
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { useState } from 'react';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { AvatarFrame } from '@/Frames/components/AvatarFrame';
import { useFrame } from '@/Frames/hook/useFrame';

// 5 Marcos disponibles + la opción de quitarlos
const availableFrames = ['none', 'libro', 'pelicula', 'cancion', 'videojuego', 'love'];

export default function FrameSelectorScreen() {
  const { avatarUrl, currentFrame } = useLocalSearchParams<{ avatarUrl?: string, currentFrame?: string }>();
  const [selectedFrame, setSelectedFrame] = useState(currentFrame || 'none');
  const { colors } = useTheme();
  const { loading, saving, handleSaveFrame } = useFrame();

  const renderAvatar = (url: string | null | undefined, frame: string, scale: number = 1) => (
    <View style={{ transform: [{ scale }], width: 112, height: 112, position: 'relative' }}>
      {url ? (
        <Image 
          source={{ uri: url }} 
          className="w-full h-full rounded-full border-2" 
          style={{ borderColor: colors.background }} 
        />
      ) : (
        <View 
          className="w-full h-full rounded-full justify-center items-center border-2" 
          style={{ borderColor: colors.background, backgroundColor: colors.surfaceButton }}
        >
          <MaterialCommunityIcons name="account" size={60} color={colors.secondaryText} />
        </View>
      )}
      {frame !== 'none' && <AvatarFrame frame={frame} />}
    </View>
  );

  return (
    <Screen>
      <ReturnButton route="back" title="Selecciona un marco" />
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Previsualización Superior (Tu foto de perfil + Marco activo) */}
        <View className="items-center justify-center py-10">
          {renderAvatar(avatarUrl, selectedFrame, 1.3)}
        </View>

        {/* Separador */}
        <View className="mx-4 h-[1px] mb-6" style={{ backgroundColor: colors.borderButton }} />

        {/* Grid 2x3 (3 columnas x 2 filas) */}
        <View className="flex-row flex-wrap justify-between">
          {availableFrames.map((frame) => {
            const isSelected = selectedFrame === frame;
            return (
              <TouchableOpacity
                key={frame}
                onPress={() => setSelectedFrame(frame)}
                className="items-center justify-center rounded-2xl mb-4"
                style={{ 
                  width: '30%', 
                  aspectRatio: 1, // Cuadrado perfecto
                  backgroundColor: isSelected ? `${colors.primary}33` : colors.surfaceButton,
                  borderWidth: 2,
                  borderColor: isSelected ? colors.primary : 'transparent'
                }}
                activeOpacity={0.7}
              >
                {frame === 'none' ? (
                  <View className="items-center justify-center">
                    <FontAwesome5 name="ban" size={32} color={colors.error} />
                  </View>
                ) : (
                  // Usamos la previsualización vacía reescalada para que quepa en la caja
                  <View className="items-center justify-center" style={{ transform: [{ scale: 0.6 }] }}>
                     {renderAvatar(null, frame, 1)}
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Botón de Guardar */}
        <TouchableOpacity
          onPress={() => handleSaveFrame(selectedFrame)}
          className="mt-8 mb-10 rounded-xl py-4 shadow-lg"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.8}
        >
          <Text className="text-center text-lg font-bold" style={{ color: colors.background }}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </Screen>
  );
}