import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import { AvatarFrame } from '@/Frames/components/AvatarFrame';
import { router } from 'expo-router';

interface Props {
  avatarUrl: string | null;
  onPickImage: () => void;
  frame: string;
}

export const ProfileAvatar = ({ avatarUrl, onPickImage, frame }: Props) => {
  const { colors } = useTheme();

  return (
    <View className="items-center justify-center">
      <View style={{ position: 'relative', paddingTop: 0 }}>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/frameSelector',
              params: { avatarUrl: avatarUrl || '', currentFrame: frame || 'none' }
            });
          }}
		  onLongPress={onPickImage}
          activeOpacity={0.7}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} className="w-28 h-28 rounded-full border-2" style={{ borderColor: colors.background }} />
          ) : (
            <View className="w-28 h-28 rounded-full justify-center items-center border-2" style={{ borderColor: colors.background, backgroundColor: colors.surfaceButton }}>
              <MaterialCommunityIcons name="account" size={60} color={colors.secondaryText} />
            </View>
          )}

          <AvatarFrame frame={frame} />
        </TouchableOpacity>      
      </View>
    </View>
  );
};