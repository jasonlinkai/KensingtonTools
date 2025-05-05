require('dotenv').config();
const { spawn } = require('child_process');
const { promisify } = require('util');

const spawnPromisify = promisify(spawn);

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
  win: {
    target: [
      {
        target: "msi",
        arch: ["x64"]
      }
    ],
    artifactName: "${productName}-setup-${version}.${ext}"
  },
  afterPack: async (context) => {
    if (process.platform === 'win32') {
      const { appOutDir, packager } = context;
      const appName = packager.appInfo.productFilename;
      const appPath = `${appOutDir}/${appName}.msi`;
      
      if (!process.env.WINDOWS_SMCTL_KEYPAIR_ALIAS) {
        console.log('Skipping Windows signing because WINDOWS_SMCTL_KEYPAIR_ALIAS is not set');
        return;
      }

      try {
        const args = [
          'sign',
          '--verbose',
          '--keypair-alias',
          process.env.WINDOWS_SMCTL_KEYPAIR_ALIAS,
          '--input',
          appPath
        ];

        console.log('Signing Windows binary with args:', args);
        // await spawnPromisify('smctl', args, {
        //   stdio: 'inherit',
        //   cwd: appOutDir
        // });
      } catch (error) {
        console.error('Failed to sign Windows binary:', error);
        throw error;
      }
    }
  }
}; 