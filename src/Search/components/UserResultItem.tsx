import { View, Text, Image, TouchableOpacity } from 'react-native';

interface User {
  id: string;
  username: string;
  description?: string;
  avatar_url?: string;
}

interface UserResultItemProps {
  item: User;
  onPress?: () => void;
}

export function UserResultItem({ item, onPress }: UserResultItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center py-3 px-1"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View className="mr-3">
        {item.avatar_url ? (
          <Image
            source={{ uri: item.avatar_url }}
            className="h-20 w-20 rounded-full"
          />
        ) : (
          <View className="h-20 w-20 items-center justify-center rounded-full bg-gray-600">
            <Text className="text-xl font-bold text-white">
              {item.username.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Información del usuario */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-primaryText">
          {item.username}
        </Text>
        {item.description && (
          <Text className="text-sm text-secondaryText" numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}