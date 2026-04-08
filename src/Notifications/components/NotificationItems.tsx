import { User } from '@/User/hooks/useUser';
import { AcceptIcon, CancelIcon } from 'components/Icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { UserResultItem } from '@/Search/components/UserResultItem';
import { useTheme } from "context/ThemeContext";
import { useState } from 'react';

interface NotificationButtonProps {
  user: User;
  status: 'pending' | 'accepted';
  myFollowStatus?: 'none' | 'pending' | 'accepted';
  handleAccept: () => void;
  handleDecline: () => void;
  onUserPress?: () => void;
  followBack : () => void;
}

export function NotificationItem({ user, status, myFollowStatus = 'none', handleAccept, handleDecline, onUserPress, followBack, }: NotificationButtonProps) {
  const { colors } = useTheme();
  const [localFollowRequested, setLocalFollowRequested] = useState(false);

  const isPendingFollow = myFollowStatus === 'pending' || localFollowRequested;
  const isAlreadyFollowing = myFollowStatus === 'accepted';

  const onFollowBackPress = () => {
	setLocalFollowRequested(true);
	followBack();
  }

  const notificationText = status === 'pending' ? 'ha solicitado seguirte' : 'ha empezado a seguirte';

  return (
    <View className="flex-row items-center py-2">
      {/* Avatar e información del usuario (clickeable) */}
      <View className="flex-1">
        <UserResultItem 
          item={{...user, username: `${user.username} ${notificationText}`}} 
          onPress={onUserPress} 
        />
      </View>
		{/*Caso en el que un usuario solicita seguirte	*/}		
	  {status === 'pending' ? (
		<View className="flex-row">
			<TouchableOpacity
				onPress={handleDecline}
				className="mr-3 h-10 w-10 items-center justify-center rounded-full" 
				style={{backgroundColor: colors.surfaceButton}}
				activeOpacity={0.7}>
				<CancelIcon />
			</TouchableOpacity>
			<TouchableOpacity
				onPress={handleAccept}
				className="mr-1 h-10 w-10 items-center justify-center rounded-full"
				style={{backgroundColor: `${colors.success}99`}}
				activeOpacity={0.7}>
				<AcceptIcon />
			</TouchableOpacity>
		</View>
	  	):(
		//Casos en los que tras aceptar, da botón de seguir de vuelta y pendiente, o nada si ya se sigue al usuario	
		!isAlreadyFollowing && (
			<TouchableOpacity
				onPress={onFollowBackPress}
				disabled={isPendingFollow}
				className="mr-1 h-10 items-center justify-center rounded-xl px-4"
				style={{
					backgroundColor: isPendingFollow ? `${colors.secondary}20` : colors.accent,
				}}
				activeOpacity={0.7}>
				<Text className="text-sm font-medium" style={{ color: isPendingFollow ? colors.secondaryText : 'white' }}>
					{isPendingFollow ? 'Pendiente' : 'Seguir de vuelta'}
				</Text>
			</TouchableOpacity>
		)
	  	)}
    </View>
  );
}