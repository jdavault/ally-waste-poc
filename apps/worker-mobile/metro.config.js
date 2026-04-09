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

// Note: Previously we had a resolveRequest override to force `react` to the
// mobile app's local node_modules because admin-web wanted ^19.2.4 and mobile
// needed 19.1.0 exact. Now that admin-web is pinned to 19.1.0 too, there's a
// single hoisted react at the monorepo root and no conflict.

module.exports = config;
