// lib/rewardedAd.web.ts
export const RewardedAd = {
  createForAdRequest: () => ({
    addAdEventListener: () => () => {},
    load: () => {},
    show: () => {},
  }),
};

export const RewardedAdEventType = {
  LOADED: 'loaded',
  EARNED_REWARD: 'earned_reward',
};

export const AdEventType = {
  CLOSED: 'closed',
  ERROR: 'error',
};

export const TestIds = {
  REWARDED: 'test-rewarded',
};