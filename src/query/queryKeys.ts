import { ResourceType, StateType } from 'hooks/useResource';

export const queryKeys = {
  appVersion: (platform: string) => ['app-version', platform] as const,
  profile: (userId?: string | null) => ['profile', userId] as const,
  publicProfile: (username?: string | null, viewerId?: string | null) =>
    ['profile', 'public', username, viewerId] as const,
  profileStats: (userId?: string | null, type?: ResourceType, year?: number) =>
    ['profile', 'stats', userId, type, year] as const,
  resources: (userId?: string | null, type?: ResourceType, filters?: Record<string, unknown>) =>
    ['resources', userId, type, filters] as const,
  resourceExists: (userId?: string | null, apiId?: string | number | null, type?: ResourceType) =>
    ['resources', 'exists', userId, type, apiId] as const,
  contentDetails: (type?: ResourceType, id?: string | number | null) =>
    ['content-details', type, id] as const,
  topFive: (userId?: string | null) => ['topFive', userId] as const,
  topFiveSelector: (userId?: string | null, type?: ResourceType) =>
    ['topFive', 'selector', userId, type] as const,
  activityFeed: (userId?: string | null) => ['activity-feed', userId] as const,
  notifications: (userId?: string | null) => ['notifications', userId] as const,
  notificationCount: (userId?: string | null) => ['notifications', 'count', userId] as const,
  userSearch: (viewerId?: string | null, term?: string | null) =>
    ['search', 'users', viewerId, term] as const,
  contentSearch: (type?: ResourceType, term?: string | null) =>
    ['search', 'content', type, term] as const,
  lists: (userId?: string | null, type?: string | null) => ['lists', userId, type] as const,
  listDetails: (listId?: string | null, type?: string | null) =>
    ['lists', 'details', listId, type] as const,
  listContainingItem: (itemId?: string | number | null, type?: string | null) =>
    ['lists', 'containing-item', itemId, type] as const,
  followers: (username?: string | null) => ['followers', username] as const,
  following: (username?: string | null) => ['following', username] as const,
  collectionOverview: (userId?: string | null, type?: ResourceType) =>
    ['collection', 'overview', userId, type] as const,
  collectionGroup: (userId?: string | null, type?: ResourceType, state?: StateType) =>
    ['collection', 'group', userId, type, state] as const,
  frames: (userId?: string | null) => ['frames', userId] as const,
};
