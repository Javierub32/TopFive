import { Book, Film, Series, Song, Game } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ResourceType } from 'hooks/useResource';
import { StyleSheet, View, Image, Pressable, useWindowDimensions } from 'react-native';
import { ContentTags } from './ContentTags';
import { useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { FallbackCover } from 'components/FallbackCover';

interface Props {
  imageUrl: string | null;
  returnRoute: string;
  content: Book | Film | Series | Song | Game;
  type: ResourceType;
  autor: string | null;
}

export const ContentHeader = ({ imageUrl, returnRoute, content, type, autor }: Props) => {
  const { colors } = useTheme();

  const [showUI, setShowUI] = useState(true);

  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const HEADER_HEIGHT = type === 'cancion' ? SCREEN_WIDTH : SCREEN_HEIGHT * 0.6;

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: HEADER_HEIGHT,
      position: 'relative',
    },
    coverImage: {
      ...StyleSheet.absoluteFillObject,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 5,
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: type === 'cancion' ? '50%' : '60%',
    },
    returnButtonContainer: {
      position: 'absolute',
      top: 5,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    tagsContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingVertical: 10,
      zIndex: 5,
    },
  });

  return (
    <Pressable
      style={styles.container}
      onPressIn={() => setShowUI(false)}
      onPressOut={() => setShowUI(true)}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl || 'https://via.placeholder.com/600x900' }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      ) : (
        <FallbackCover type={type} fullSize={true} style={styles.container} />
      )}

      {showUI && (
        <Animated.View
          style={styles.overlay}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}>
          <LinearGradient
            colors={['transparent', `${colors.background}99`, colors.background]}
            locations={[0.0, 0.5, 1.0]}
            style={styles.gradient}
          />
          <View style={styles.tagsContainer}>
            <ContentTags content={content} type={type} autor={autor} />
          </View>

          <View style={styles.returnButtonContainer} className="px-4 pb-4 pt-2">
            <ReturnButton route={returnRoute} title="" style={' '} />
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
};
