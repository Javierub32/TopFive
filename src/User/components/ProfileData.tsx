import { View, Text } from 'react-native';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  username: string;
  description?: string;
  followersCount: number;
  followingCount: number;
}

export function ProfileData({ children, username, description, followersCount, followingCount }: Props) {
  return (
    <View className="p-4">
      {/* Se le pasa por props el avatar porque así podemos mostrar las estadísticas del usuario tanto con el perfil (puede actualizar su foto), como en la página de búsqueda (no se permite modificar la foto de otros usuarios) */}
      <View className="flex-row items-center mb-4">
        {children}
        <View className="flex-1 flex-row justify-around items-center ml-5">
          <View className="items-center">
            <Text className="text-lg font-bold text-primaryText">
              {followersCount}
            </Text>
            <Text className="text-xs text-primaryText/60">Seguidores</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-primaryText">
              {followingCount}
            </Text>
            <Text className="text-xs text-primaryText/60">Siguiendo</Text>
          </View>
        </View>
      </View>

      {/* Nombre de usuario */}
      <Text className="text-sm font-semibold text-primaryText mb-1">{username}</Text>

      {/* Descripción */}
      {description && (
        <Text className="text-sm text-primaryText/80 mb-4">
          {description}
        </Text>
      )}
    </View>
  );
}
