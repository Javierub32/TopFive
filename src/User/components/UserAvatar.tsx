import { View, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

interface Props {
  avatarUrl: string | null;
  size?: number;
}

export function UserAvatar({ avatarUrl, size = 90 }: Props) {
  const [isPressed, setIsPressed] = useState(false);
  const radius = size / 2;

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.7}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: size, height: size, borderRadius: radius }}
          />
        ) : (
          <View
            style={{
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: '#374151',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons name="account" size={size * 0.55} color="#9CA3AF" />
          </View>
        )}
      </TouchableOpacity>

      <Image
        source={require('../../../assets/gorro-navideño.png')}
        style={{
          position: 'absolute',
          top: isPressed ? -5 : -2,
          right: isPressed ? -14 : -8,
          width: isPressed ? size * 0.55 : size * 0.5,
          height: isPressed ? size * 0.66 : size * 0.61,
          transform: [{ rotate: '20deg' }],
        }}
        resizeMode="contain"
      />
    </View>
  );
}
