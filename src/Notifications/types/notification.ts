import { ResourceType } from 'hooks/useResource';
import { User } from '@/User/hooks/useUser';

export type FollowStatus = 'none' | 'pending' | 'accepted';

export interface BaseNotification {
  key: string;
  kind: 'social' | 'resource';
  date: string;
}

export interface SocialNotification extends BaseNotification {
  kind: 'social';
  id: number;
  follower_id: string;
  following_id: string;
  status: 'pending' | 'accepted';
  user: User;
  myFollowStatus: FollowStatus;
}

export interface ResourceNotification extends BaseNotification {
  kind: 'resource';
  id: number;
  isComment: boolean;
  read: boolean;
  resourceId: number;
  resourceType: ResourceType;
  title: string;
  imageUrl: string | null;
  /** Fila de recursoX ya normalizada, lista para pasar a los details del resource. */
  resource: unknown;
}

export type AppNotification = SocialNotification | ResourceNotification;
