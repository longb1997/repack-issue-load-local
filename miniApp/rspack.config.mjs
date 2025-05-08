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
        name: 'miniApp',
        filename: 'mini.container.js.bundle',
        dts: false,
        exposes: {
          './Root': './App.tsx',
        },
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
        },
      }),
    ],
  };
};
