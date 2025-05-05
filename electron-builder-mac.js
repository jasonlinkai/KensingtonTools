require('dotenv').config();
const packageJson = require('./package.json');
/**
 * @type {import('electron-builder').Configuration}
 */
module.exports = {
  appId: process.env.APPLE_BUNDLE_ID,
  productName: "Kensington Tools",
  directories: {
    output: "release"
  },
  files: [
    "dist/**/*", 
    "package.json",
    "resources/**/*"
  ],
  asar: true,
  icon: "resources/appIcon",
  extraMetadata: {
    version: packageJson.version || process.env.APP_VERSION,
    author: { name: 'Kensington, a division of ACCO BRANDS', email: 'support@kensington.com' },
    description: "LLM translation tool",
  },
  mac: {
    category: "public.app-category.productivity",
    target: [
      {
        target: "dmg",
        arch: ["universal"]
      }
    ],
    artifactName: "${productName}-universal.${ext}",
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: "mac/entitlements.mac.plist",
    entitlementsInherit: "mac/entitlements.mac.plist",
    identity: `${process.env.APPLE_TEAM_NAME} (${process.env.APPLE_TEAM_ID})`,
    notarize: {
      teamId: process.env.APPLE_TEAM_ID,
    }
  },
}; 