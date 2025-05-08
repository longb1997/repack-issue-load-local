import {loadRemote} from '@module-federation/runtime';
import React, {createRef, memo} from 'react';
import {Platform, View} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const downloadRef = createRef<any>();

const {fs, config} = RNFetchBlob;
const rootDir = fs.dirs.CacheDir + '/miniapps';

const path = `${rootDir}/miniApp/0.0.1/${Platform.OS}`;

export const FILES = [
  'index.bundle',
  'index.bundle.map',
  'mini.container.js.bundle',
  'mini.container.js.bundle.map',
  '__federation_expose_Root.chunk.bundle',
  '__federation_expose_Root.chunk.bundle.map',
  'mf-manifest.json',
  'mf-stats.json',
];

export const downloadSystemFileMiniApp = async ({files}: {files: string[]}) => {
  try {
    const isDir = await fs.isDir(path);
    if (!isDir) {
      await fs.mkdir(path);
    } else {
      try {
        await fs.unlink(path);
        await fs.mkdir(path);
      } catch (error) {
        console.log('error unlink and mkdir ', error);
      }
    }

    const rootUrl = `http://10.20.1.164:80/build/generated/${Platform.OS}`; // CHANGE TO YOUR NODE SERVER, DON'T USE LOCALHOST IT'S NOT WORK

    const len = files.length;

    for (let i = 0; i < len; i++) {
      const file = files[i];
      const url = rootUrl + '/' + file;
      const newPath = path + '/' + file;

      const exists = await fs.exists(newPath);
      if (exists) {
        await fs.unlink(newPath);
      }

      await new Promise((resolve, reject) => {
        downloadRef.current = config({
          fileCache: true,
          overwrite: true,
        }).fetch('GET', url);

        downloadRef.current
          .then(async (res: any) => {
            try {
              const exists = await fs.exists(newPath);
              if (!exists) {
                await fs.cp(res.path(), newPath);
              }
            } catch (error) {
              console.log('error copy file ', error);
            }
            res.flush();
            resolve(true);
          })
          .catch((_error: any) => {
            console.log('error = ', _error.toString());
            if (_error?.message === 'canceled') {
              reject('Please try again, do not close the app');
              return;
            }
            reject(_error);
          });
      });
    }
    downloadRef.current = null;
    return {
      success: true,
      error: '',
    };
  } catch (error: any) {
    console.log('error downloadSystemFileMiniApp ', error);
  }
};

const AppComponent = memo(({component}) => {
  return <View style={{flex: 1}}>{component}</View>;
});

const MiniApp = React.lazy(() => loadRemote('miniApp/Root'));
// Me
export const MiniAppScreen = memo(() => {
  return <AppComponent component={<MiniApp />} name={'MiniApp'} />;
});
