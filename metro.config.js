const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  buffer: 'buffer',
};

config.resolver.fallback = {
  buffer: require.resolve('buffer'),
};

module.exports = config;