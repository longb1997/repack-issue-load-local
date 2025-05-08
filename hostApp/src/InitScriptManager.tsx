import {init, registerRemotes} from '@module-federation/runtime';
import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export const initMiniAppScriptManager = () => {
  const rootDir = RNFetchBlob.fs.dirs.CacheDir + '/miniapps';

  const getSystemPath = (v: string) => ({
    ['miniApp']: `file://${rootDir}/miniApp/${v}/${Platform.OS}/`,
  });

  try {
    // Initialize Module Federation Runtime
    init({
      name: 'hostApp',
      remotes: [], // We'll register remotes dynamically below
    });

    // Register remote modules based on mode
    const registerFederatedModules = () => {
      const remotes: Array<{name: string; entry: string; alias?: string}> = [];
      const version = '0.0.1'; // Default version if none available
      const route = 'miniApp';
      const entryUrl = getSystemPath(version)[route] + 'mf-manifest.json';
      if (entryUrl) {
        remotes.push({
          name: `hostApp/${route}`,
          alias: route,
          entry: entryUrl,
        });
      }

      console.log('remotes ', remotes);
      registerRemotes(remotes);
    };
    registerFederatedModules();
  } catch (e) {
    console.log('error init mini app ', e);
  }
};
