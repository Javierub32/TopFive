import { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'context/ThemeContext';
import {
  ScalableBookIcon,
  ScalableFilmIcon,
  ScalableGameIcon,
  ScalableMusicIcon,
  ScalableShowIcon,
} from 'components/Icons';
import { ResourceType } from 'hooks/useResource';
import { NotificationItemLayout } from './NotificationItemLayout';

// Fallback
const TYPE_ICON: Record<ResourceType, ComponentType<any>> = {
  libro: ScalableBookIcon,
  pelicula: ScalableFilmIcon,
  serie: ScalableShowIcon,
  videojuego: ScalableGameIcon,
  cancion: ScalableMusicIcon,
};

const RESOURCE_PLACEHOLDER = '\u0000';

interface NotificationResourceItemProps {
  title: string;
  imageUrl?: string | null;
  resourceType: ResourceType;
  isComment: boolean;
  onPress?: () => void;
}

export function NotificationResourceItem({
  title,
  imageUrl,
  resourceType,
  isComment,
  onPress,
}: NotificationResourceItemProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const Icon = TYPE_ICON[resourceType];

  const sentence = t(isComment ? 'notifications.resourceComment' : 'notifications.resourceLike', {
    resource: RESOURCE_PLACEHOLDER,
  });
  const [before, after = ''] = sentence.split(RESOURCE_PLACEHOLDER);

  return (
    <NotificationItemLayout
      imageUrl={imageUrl}
      imageFallback={Icon ? <Icon size={28} color={colors.secondaryText} /> : null}
      textBefore={before}
      highlight={title}
      textAfter={after}
      onPress={onPress}
      rounded={false}
    />
  );
}
