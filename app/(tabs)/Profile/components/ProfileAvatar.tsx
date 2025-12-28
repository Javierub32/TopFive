import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  avatarUrl: string | null;
  username: string;
  isPressed: boolean;
  onPickImage: () => void;
  setIsPressed: (val: boolean) => void;
}

export const ProfileAvatar = ({ avatarUrl, username, isPressed, onPickImage, setIsPressed }: Props) => (
  <View className="items-center p-2">
    <View style={{ position: 'relative', paddingTop: 20 }}>
      <TouchableOpacity
        onPress={onPickImage}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.7}
      >
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={{ width: 120, height: 120, borderRadius: 60 }} />
        ) : (
          <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons name="account" size={60} color="#9CA3AF" />
          </View>
        )}
      </TouchableOpacity>

      <Image
        source={require('../../../../assets/gorro-navideño.png')}
        style={{
          position: 'absolute',
          top: isPressed ? 2 : 5,
          right: isPressed ? -14 : -5,
          width: isPressed ? 60 : 50,
          height: isPressed ? 70 : 60,
          transform: [{ rotate: '20deg' }],
        }}
        resizeMode="contain"
      />

      <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#a855f7', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1f2937' }}>
        <MaterialCommunityIcons name="camera" size={16} color="#fff" />
      </View>
    </View>
    <Text className="mb-3 mt-5 text-center text-2xl font-bold text-white">{username}</Text>
  </View>
);