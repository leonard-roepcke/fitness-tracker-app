const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Use compiled output for packages that point "react-native" to TypeScript source.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-draggable-flatlist') {
    return context.resolveRequest(
      context,
      'react-native-draggable-flatlist/lib/commonjs/index',
      platform
    );
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
