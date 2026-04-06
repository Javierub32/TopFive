import { View, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTheme } from 'context/ThemeContext';
import { AvatarFrame } from '@/Frames/components/AvatarFrame';

interface Props {
  avatarUrl: string | null;
  size?: number;
  frame: string;
}

export function UserAvatar({ avatarUrl, frame }: Props) {
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

          {frame && frame !== 'none' && <AvatarFrame frame={frame} />}
        </TouchableOpacity>      
      </View>
    </View>
  );
}
