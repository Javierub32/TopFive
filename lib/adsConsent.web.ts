export const AdsConsent = {
  requestInfoUpdate: async () => ({ isConsentFormAvailable: false, status: 'NOT_REQUIRED' }),
  showForm: async () => {},
};

export const AdsConsentStatus = {
  REQUIRED: 'REQUIRED',
  NOT_REQUIRED: 'NOT_REQUIRED',
};