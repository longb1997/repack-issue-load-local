import * as Repack from '@callstack/repack';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Webpack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about webpack configuration: https://webpack.js.org/configuration/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */
console.log('__dirname', __dirname);
export default env => {
  const {
    mode = 'development',
    context = __dirname,
    entry = './index.js',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
  } = env;
  const dirname = Repack.getDirname(import.meta.url);

  if (!platform) {
    throw new Error('Missing platform');
  }
  process.env.BABEL_ENV = mode;

  return {
    mode,
    entry,
    devtool: 'source-map',
    context,
    resolve: {
      ...Repack.getResolveOptions(platform),
    },
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      path: path.join(dirname, 'build/generated', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
    },
    optimization: {
      minimize,
      chunkIds: 'named',
    },
    module: {
      rules: [
        ...Repack.getJsTransformRules(),
        ...Repack.getAssetTransformRules(),
        {
          test: /\.jsx?$/,
          type: 'javascript/auto',
          include: Repack.getModulePaths([
            '@react-native-masked-view',
            'react-native-version-check',
            'rn-fetch-blob',
            'react-native-modal-datetime-picker',
            'react-native-version-check',
            'react-native-image-crop-picker',
            '@base/ui-kit',
            '@base/core',
            '@react-native-community/image-editor',
            'react-native-keyboard-aware-scroll-view',
            'react-native-video',
            // 'redux-flipper',
            'react-native-keyboard-aware-scroll-view',
            'react-native-create-thumbnail',
          ]),
          use: {
            loader: '@callstack/repack/flow-loader',
            options: {all: true},
          },
        },
        {
          test: /\.[jt]sx?$/,
          type: 'javascript/auto',
          exclude: [/node_modules/],
          use: {
            loader: 'builtin:swc-loader',
            options: {
              env: {
                targets: {'react-native': '0.76.7'},
              },
              jsc: {
                parser: {
                  syntax: 'typescript',
                  jsx: true,
                  dynamicImport: true,
                  decorators: true,
                  topLevelAwait: true,
                },
                assumptions: {
                  setPublicClassFields: true,
                  privateFieldsAsProperties: true,
                },
                externalHelpers: true,
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
        },
        {
          test: Repack.getAssetExtensionsRegExp(
            Repack.ASSET_EXTENSIONS.filter(ext => ext !== 'svg'),
          ),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
            },
          },
        },
        {
          test: /\.svg$/,
          include: /assets\/source\//,
          type: 'asset/source',
        },
        {
          test: /\.svg$/,
          include: /assets\/inline\//,
          type: 'asset/inline',
        },
      ],
    },
    plugins: [
      new Repack.RepackPlugin(),

      new Repack.plugins.ModuleFederationPluginV2({
        name: 'hostApp',
        shared: {
          react: {
            eager: true,
            singleton: true,
            requiredVersion: '18.3.1',
          },
          'react-native': {
            eager: true,
            singleton: true,
            requiredVersion: '0.76.9',
          },
          '@module-federation/enhanced': {
            singleton: true,
            eager: true,
            requiredVersion: '^0.13.1',
          },
          '@react-navigation/native-stack': {singleton: true, eager: true},
          '@react-navigation/stack': {singleton: true, eager: true},
          '@react-navigation/native': {singleton: true, eager: true},
          '@react-navigation/bottom-tabs': {singleton: true, eager: true},
          'react-native-screens': {singleton: true, eager: true},
        },
      }),
    ],
  };
};
