import { View, Text, Pressable } from 'react-native';
import { ReactNode } from 'react';
import { router } from 'expo-router';
import { useTheme } from 'context/ThemeContext';

interface Props {
  children: ReactNode;
  username: string;
  description?: string;
  followersCount: number;
  followingCount: number;
}

export function ProfileData({
  children,
  username,
  description,
  followersCount,
  followingCount,
}: Props) {
  const { colors } = useTheme();

  return (
    <View className="p-4">
      {/* Se le pasa por props el avatar porque así podemos mostrar las estadísticas del usuario tanto con el perfil (puede actualizar su foto), como en la página de búsqueda (no se permite modificar la foto de otros usuarios) */}
      <View className="flex-row items-center">
        <View className="mb-4 items-center justify-center justify-self-start">{children}</View>
        <View className="ml-4 flex-1">
          {/* Estadísticas */}
          <View className="mb-4 flex-row items-center justify-around">
            <View className="mr-4 items-center">
              <Pressable
                onPress={() => {
                  router.push(`/followers?username=${username}&page=followers`);
                }}>
                <Text className="text-lg font-bold" style={{ color: colors.primaryText }}>{followersCount}</Text>
                <Text className="text-xs" style={{ color: colors.secondaryText }}>Seguidores</Text>
              </Pressable>
            </View>
            <View className="items-center">
              <Pressable
                onPress={() => {
                  router.push(`/followers?username=${username}&page=following`);
                }}>
                <Text className="text-lg font-bold" style={{ color: colors.primaryText }}>{followingCount}</Text>
                <Text className="text-xs" style={{ color: colors.secondaryText }}>Siguiendo</Text>
              </Pressable>
            </View>
          </View>

          {/* Nombre de usuario y descripción */}
          <View>
            {/* Descripción */}
            {description && (
              <Text className="text-sm leading-tight" style={{ color: colors.secondaryText }}>{description}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
