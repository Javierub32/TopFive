import { User } from '@/User/hooks/useUser';
import { AcceptIcon, CancelIcon } from 'components/Icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface NotificationButtonProps {
  user: User;
  handleAccept: () => void;
  handleDecline: () => void;
}

export function NotificationButton({ user, handleAccept, handleDecline }: NotificationButtonProps) {
  return (
    <View className="flex-row items-center px-1 py-3">
      {/* Avatar */}
      <View className="mr-3">
        {user.avatar_url ? (
          <Image source={{ uri: user.avatar_url }} className="h-20 w-20 rounded-full" />
        ) : (
          <View className="h-20 w-20 items-center justify-center rounded-full bg-gray-600">
            <Text className="text-xl font-bold text-white">
              {user.username.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Información del usuario */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-primaryText">{user.username}</Text>
        {user.description && (
          <Text className="text-sm text-secondaryText" numberOfLines={2}>
            {user.description}
          </Text>
        )}
      </View>

	  {/* Botón de cancelar */}
		<TouchableOpacity
			  onPress={handleDecline}
			  className="mr-3 h-10 w-10 items-center justify-center rounded-full border border-borderButton bg-surfaceButton"
			  activeOpacity={0.7}>
			<CancelIcon />
		</TouchableOpacity>

				<TouchableOpacity
			  onPress={handleAccept}
			  className="mr-3 h-10 w-10 items-center justify-center rounded-full border border-borderButton bg-surfaceButton"
			  activeOpacity={0.7}>
			<AcceptIcon />
		</TouchableOpacity>
    </View>
  );
}
