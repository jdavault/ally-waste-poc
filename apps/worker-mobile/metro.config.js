const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// Resolve modules from the mobile app's node_modules first, then root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Map shared packages
config.resolver.extraNodeModules = {
  '@ally-waste/shared-types': path.resolve(monorepoRoot, 'packages/shared-types'),
};

// Force ALL react imports to resolve to the mobile app's local react (19.1.0)
// This prevents expo/RN packages in root node_modules from picking up root react (19.2.4)
const mobileReactDir = path.resolve(projectRoot, 'node_modules/react');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    const newContext = { ...context, nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')] };
    return context.resolveRequest(newContext, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
