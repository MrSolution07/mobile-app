const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('bin'); // Add 'bin' to the list of recognized asset file extensions.

module.exports = config;
