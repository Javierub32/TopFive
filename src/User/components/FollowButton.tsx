import { useTheme } from 'context/ThemeContext';
import { Text, TouchableOpacity, View } from 'react-native';

interface FollowButtonProps {
  isFollowed: boolean;
  isRequested: boolean;
  handleFollow: () => void;
  cancelRequest?: () => void;
}

export function FollowButton({
  isFollowed,
  isRequested,
  handleFollow,
  cancelRequest,
}: FollowButtonProps) {
  const { colors } = useTheme();

  if (!isFollowed && !isRequested) {
    return (
      <View className='flex items-center'>
        <TouchableOpacity
          className="items-center px-4 flex w-2/3 rounded-md py-2"
          style={{ backgroundColor: colors.accent }}
          onPress={handleFollow}>
          <Text className="font-semibold" style={{ color: colors.primaryText }}>Seguir</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (!isFollowed && isRequested) {
    return (
      <View className='flex items-center'>
        <TouchableOpacity
          className="items-center px-4 flex w-2/3 rounded-md py-2"
          style={{ backgroundColor: colors.surfaceButton }}
          onPress={cancelRequest}>
          <Text className="font-semibold" style={{ color: colors.primaryText }}>Solicitud enviada</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return null;
}
