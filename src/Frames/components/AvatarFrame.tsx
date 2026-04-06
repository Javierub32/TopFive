import { Image } from 'react-native';
import { frameAdapter } from '../adapter/frameAdapter';
import { useTheme } from 'context/ThemeContext';

export const AvatarFrame = ({ frame }: { frame: string }) => {
  const { isDark } = useTheme();
  if (!frame || frame === 'none') return null;
  const actualFrame = (isDark && frame === 'pelicula') ? 'peliculaDark' : frame;
  
  const frameSource = frameAdapter.getFrame(actualFrame);
  const { top, left, width, height, rotate } = frameAdapter.getPositionAndSize(actualFrame);

  return frame ? (
    <Image
      source={frameSource}
      style={{
        position: 'absolute',
        top: top,
        right: left,
        width: width,
        height: height,
        transform: [{ rotate: rotate }],
      }}
      resizeMode="contain"
    />
  ) : null;
};
