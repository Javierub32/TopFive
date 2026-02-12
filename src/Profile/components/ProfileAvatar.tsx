import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';

interface Props {
  avatarUrl: string | null;
  isPressed: boolean;
  onPickImage: () => void;
  setIsPressed: (val: boolean) => void;
}

export const ProfileAvatar = ({ avatarUrl, isPressed, onPickImage, setIsPressed }: Props) => {
  const { colors } = useTheme();

  return (
    <View className="items-center justify-center">
      <View style={{ position: 'relative', paddingTop: 0 }}>
        <TouchableOpacity
          onPress={onPickImage}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={0.7}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} className="w-28 h-28 rounded-full border-2" style={{ borderColor: colors.background }} />
          ) : (
            <View className="w-28 h-28 rounded-full justify-center items-center border-2" style={{ borderColor: colors.background, backgroundColor: colors.surfaceButton }}>
              <MaterialCommunityIcons name="account" size={60} color={colors.secondaryText} />
            </View>
          )}

          <Image
          source={require('../../../assets/gorro-navideño.png')}
          style={{
            position: 'absolute',
            top: isPressed ? -18 : -15,
            right: isPressed ? -13 : -10,
            width: isPressed ? 55 : 50,
            height: isPressed ? 65 : 60,
            transform: [{ rotate: '70deg' }],
          }}
          resizeMode="contain"
          />

          <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.surfaceButton, borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.background }}>
            <MaterialCommunityIcons name="camera" size={16} color={colors.primaryText} />
          </View>
        </TouchableOpacity>      
      </View>
    </View>
  );
};