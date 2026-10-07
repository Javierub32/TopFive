import { AppNotification, ResourceNotification, SocialNotification } from '../types/notification';
import { NotificationResourceItem } from './NotificationResourceItem';
import { NotificationSocialItem } from './NotificationSocialItem';

interface NotificationItemProps {
  notification: AppNotification;
  onAccept: (notification: SocialNotification) => void;
  onDecline: (notification: SocialNotification) => void;
  onFollowBack: (notification: SocialNotification) => void;
  onUserPress: (notification: SocialNotification) => void;
  onResourcePress: (notification: ResourceNotification) => void;
}

// Para escalibilidad en un futuro si hubiesen más tipos de notificaciones
export function NotificationItem({
  notification,
  onAccept,
  onDecline,
  onFollowBack,
  onUserPress,
  onResourcePress,
}: NotificationItemProps) {
  switch (notification.kind) {
    case 'social':
      return (
        <NotificationSocialItem
          user={notification.user}
          status={notification.status}
          myFollowStatus={notification.myFollowStatus}
          handleAccept={() => onAccept(notification)}
          handleDecline={() => onDecline(notification)}
          onUserPress={() => onUserPress(notification)}
          followBack={() => onFollowBack(notification)}
        />
      );
    case 'resource':
      return (
        <NotificationResourceItem
          title={notification.title}
          imageUrl={notification.imageUrl}
          resourceType={notification.resourceType}
          isComment={notification.isComment}
          onPress={() => onResourcePress(notification)}
        />
      );
  }
}
