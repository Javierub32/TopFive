import { Image } from 'react-native';
import { frameAdapter } from '../adapter/frameAdapter';
import { useTheme } from 'context/ThemeContext';

export const AvatarFrame = ({ frame }: { frame: string }) => {
  const { isDark } = useTheme();
  if (!frame || frame === 'none') return null;
  const actualFrame = isDark && frame === 'pelicula' ? 'peliculaDark' : frame;

  const frameSource = frameAdapter.getFrame(actualFrame);
  const { top, left, width, rotate } = frameAdapter.getPositionAndSize(actualFrame);

  return frame ? (
    <Image
      source={frameSource}
      style={{
        position: 'absolute',
        top: top || '50%',
        left: left || '50%',
        width: width,
        height: width,
        // Centramos el marco respecto al centro del avatar
        transform: [{ translateX: -(width / 2) }, { translateY: -(width / 2) }, { rotate: rotate }],
      }}
      resizeMode="contain"
    />
  ) : null;
};
