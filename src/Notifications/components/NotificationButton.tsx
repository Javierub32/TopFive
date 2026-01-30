import { User } from '@/User/hooks/useUser';
import { AcceptIcon, CancelIcon } from 'components/Icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { UserResultItem } from '@/Search/components/UserResultItem';

interface NotificationButtonProps {
  user: User;
  handleAccept: () => void;
  handleDecline: () => void;
  onUserPress?: () => void;
}

export function NotificationButton({ user, handleAccept, handleDecline, onUserPress }: NotificationButtonProps) {
  return (
    <View className="flex-row items-center">
      {/* Avatar e información del usuario (clickeable) */}
      <View className="flex-1">
        <UserResultItem item={user} onPress={onUserPress} />
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
			  className="mr-1 h-10 w-10 items-center justify-center rounded-full border border-borderButton bg-surfaceButton"
			  activeOpacity={0.7}>
			<AcceptIcon />
		</TouchableOpacity>
    </View>
  );
}
