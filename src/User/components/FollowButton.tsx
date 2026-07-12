import { useTheme } from 'context/ThemeContext';
import { Text, TouchableOpacity, View } from 'react-native';
import {AppText} from 'components/AppText';
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
      <View className='flex items-center mt-6'>
        <TouchableOpacity
          className="items-center px-4 flex w-2/3 rounded-md py-2"
          style={{ backgroundColor: colors.accent }}
          onPress={handleFollow}>
          <AppText className="font-semibold" style={{ color: colors.primaryText, fontSize: 14}}>Seguir</AppText>
        </TouchableOpacity>
      </View>
    );
  }
  if (!isFollowed && isRequested) {
    return (
      <View className='flex items-center  mt-6'>
        <TouchableOpacity
          className="items-center px-4 flex w-2/3 rounded-md py-2"
          style={{ backgroundColor: colors.surfaceButton }}
          onPress={cancelRequest}>
          <AppText className="font-semibold" style={{ color: colors.primaryText, fontSize: 14 }}>Solicitud enviada</AppText>
        </TouchableOpacity>
      </View>
    );
  }
  return null;
}
