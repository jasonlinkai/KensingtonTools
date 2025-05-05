require('dotenv').config();
const { spawn } = require('child_process');
const { promisify } = require('util');
const packageJson = require('./package.json');

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
  extraMetadata: {
    name: "Kensington Tools",
    version: packageJson.version || process.env.APP_VERSION,
    author: { name: 'Kensington, a division of ACCO BRANDS', email: 'support@kensington.com' },
    description: "LLM translation tool",
  },
  win: {
    target: [
      {
        target: "msi",
        arch: ["x64"]
      }
    ],
    artifactName: "${productName}-setup-${version}.${ext}"
  },
  afterAllArtifactBuild: async (context) => {
    if (process.platform === 'win32') {
      const { appOutDir } = context;
      
      if (!process.env.WINDOWS_SMCTL_KEYPAIR_ALIAS) {
        console.log('Skipping Windows signing because WINDOWS_SMCTL_KEYPAIR_ALIAS is not set');
        return;
      }

      const sign = async (appPath) => {
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
          await spawnPromisify('smctl', args, {
            stdio: 'inherit',
            cwd: appOutDir
          });
          console.log('Windows binary signed successfully');
        } catch (error) {
          console.error('Failed to sign Windows binary:', error);
          throw error;
        }
      }

      for (const artifactPath of context.artifactPaths) {
        await sign(artifactPath);
      }
    }
  }
}; 