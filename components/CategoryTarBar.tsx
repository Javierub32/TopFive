import { useState } from 'react';
import { View, TouchableOpacity, Animated, LayoutChangeEvent } from 'react-native';
import { TabBarProps } from 'react-native-tab-view';
import { useTheme } from 'context/ThemeContext';
import { BookIcon, FilmIcon, ShowIcon, GameIcon, MusicIcon } from 'components/Icons';

export const CategoryTabBar = (props: TabBarProps<any>) => {
  const { colors } = useTheme();
  const [tabBarWidth, setTabBarWidth] = useState(0);

  const tabCount = props.navigationState.routes.length;
  const availableWidth = tabBarWidth - 8; // Ajuste por padding
  const tabWidth = availableWidth / tabCount;

  const translateX = props.position.interpolate({
    inputRange: props.navigationState.routes.map((_, i) => i),
    outputRange: props.navigationState.routes.map((_, i) => i * tabWidth),
  });

  const renderIcon = (key: string, isActive: boolean) => {
    const iconProps = { size: 24, color: isActive ? 'white' : '#94a3b8' };
    switch (key) {
      case 'libro': return <BookIcon {...iconProps} />;
      case 'pelicula': return <FilmIcon {...iconProps} />;
      case 'serie': return <ShowIcon {...iconProps} />;
      case 'videojuego': return <GameIcon {...iconProps} />;
      case 'cancion': return <MusicIcon {...iconProps} />;
      default: return null;
    }
  };

  return (
    <View className="py-2 bg-transparent">
      <View 
        className="rounded-lg border border-borderButton bg-surfaceButton p-1 shadow-lg"
        onLayout={(e: LayoutChangeEvent) => setTabBarWidth(e.nativeEvent.layout.width)}
      >
        <View className="flex-row relative h-10">
          {tabBarWidth > 0 && (
            <Animated.View 
              style={{
                position: 'absolute',
                top: 0, bottom: 0, left: 0,
                width: tabWidth, 
                backgroundColor: colors.secondary,
                borderRadius: 6,
                transform: [{ translateX }] 
              }} 
            />
          )}

          {props.navigationState.routes.map((route, i) => {
            const isActive = props.navigationState.index === i;
            return (
              <TouchableOpacity
                key={route.key}
                activeOpacity={0.7}
                className="flex-1 justify-center items-center z-10"
                onPress={() => props.jumpTo(route.key)}
              >
                {renderIcon(route.key, isActive)}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};