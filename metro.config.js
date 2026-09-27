const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // Bibliotecas que causan problema en la web
    const isBlockedNativeLibrary = 
      moduleName === 'react-native-collapsible-tab-view' || 
      moduleName === 'react-native-pager-view' ||
      moduleName === 'react-native-draggable-flatlist';

    if (isBlockedNativeLibrary) {
      return {
        type: 'empty'
      };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

module.exports = withNativeWind(config, { input: './global.css' });
