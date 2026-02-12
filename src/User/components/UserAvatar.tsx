import { View, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTheme } from 'context/ThemeContext';

interface Props {
  avatarUrl: string | null;
  size?: number;
}

export function UserAvatar({ avatarUrl }: Props) {
  const [isPressed, setIsPressed] = useState(false);
  const { colors } = useTheme();

  return (
    <View className="items-center justify-center">
      <View style={{ position: 'relative', paddingTop: 0 }}>
        <TouchableOpacity
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
        </TouchableOpacity>      
      </View>
    </View>
  );
}
