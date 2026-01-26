import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from 'constants/colors';

interface Props {
  avatarUrl: string | null;
  isPressed: boolean;
  onPickImage: () => void;
  setIsPressed: (val: boolean) => void;
}

export const ProfileAvatar = ({ avatarUrl, isPressed, onPickImage, setIsPressed }: Props) => (
  <View className="items-center justify-center">
    <View style={{ position: 'relative', paddingTop: 0 }}>
      <TouchableOpacity
        onPress={onPickImage}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.7}
      >
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="w-28 h-28 rounded-full border-2 border-background"/>
        ) : (
          <View className="w-28 h-28 rounded-full bg-gray-700 justify-center items-center border-2 border-background">
            <MaterialCommunityIcons name="account" size={60} color="#9CA3AF" />
          </View>
        )}

        <Image
        source={require('../../../assets/gorro-navideño.png')}
        style={{
          position: 'absolute',
          top: isPressed ? -15 : -10,
          right: isPressed ? -10 : -5,
          width: isPressed ? 55 : 50,
          height: isPressed ? 65 : 60,
          transform: [{ rotate: '20deg' }],
        }}
        resizeMode="contain"
        />

        <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.surfaceButton, borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.background }}>
          <MaterialCommunityIcons name="camera" size={16} color="#fff" />
        </View>
      </TouchableOpacity>      
    </View>
  </View>
);