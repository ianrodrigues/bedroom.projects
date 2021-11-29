import * as i from 'types';
import React from 'react';

import { isHTMLVideoElement } from 'services/typeguards';
import AssetLoaderWorker from 'workers/AssetLoader?worker';

const assetLoaderWorker = new AssetLoaderWorker();

export const AssetsLoaderContext = React.createContext<AssetsLoaderContextProps | null>(null);

const AssetsLoaderProvider: React.FC = (props) => {
  const [amount, setAmount] = React.useState(0);
  const [amountLoaded, setAmountLoaded] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const resolvers = {} as Resolvers;

  React.useEffect(() => {
    assetLoaderWorker.addEventListener('message', onWorkerDone);

    return function cleanup() {
      assetLoaderWorker.removeEventListener('message', onWorkerDone);
    };
  }, []);

  React.useEffect(() => {
    if (done) {
      if (__DEV__) {
        console.info('All loaded');
      }

      setAmount(0);
      setAmountLoaded(0);
    }
  }, [done]);

  React.useEffect(() => {
    if (amount > 0 && amountLoaded === amount) {
      setDone(true);
    }
  }, [amount, amountLoaded]);

  function AddAsset() {
    setDone(false);
    setAmount((amt) => amt + 1);
  }

  function onAssetLoaded() {
    setAmountLoaded((amt) => amt + 1);
  }

  async function onWorkerDone(evt: MessageEvent<i.AssetLoaderWorkerMessage>) {
    const { url } = evt.data;

    // +1 assets loaded
    onAssetLoaded();

    // Resolve the promise for this URL with its element
    resolvers[url]?.resolve(resolvers[url]!.el as any); // eslint-disable-line

    // Remove from memory
    delete resolvers[url];
  }

  async function addImageAsset(cb: AddAssetCb<HTMLImageElement>): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      AddAsset();

      const img = document.createElement('img');

      // Let callback do stuff with img element
      cb(img);

      // Dev server web worker only works in Chrome
      if (__DEV__ && 'chrome' in window) {
        if (img.src.length > 0) {
          // Load image with worker
          assetLoaderWorker.postMessage(img.src);

          // Add img el and resolver to memory
          resolvers[img.src] = {
            el: img,
            resolve,
          };
        } else {
          console.error(
            'Attempted to load an image but the image element returned without a valid src',
          );
        }
      } else {
        function onLoad() {
          onAssetLoaded();
          img.removeEventListener('load', onLoad);
          resolve(img);
        }

        img.addEventListener('load', onLoad);
      }
    });
  }

  function addVideoAsset(cb: AddAssetCb<HTMLVideoElement>): Promise<HTMLVideoElement> {
    return new Promise((resolve) => {
      AddAsset();

      const video = document.createElement('video');
      cb(video);

      function onCanPlay(this: GlobalEventHandlers) {
        onAssetLoaded();
        video.removeEventListener('canplay', onCanPlay);

        // Chrome muted autoplay bugfix
        if (isHTMLVideoElement(this)) {
          this.muted = true;
          this.play();
        }

        resolve(video);
      }

      video.addEventListener('canplay', onCanPlay);
    });
  }

  return (
    <AssetsLoaderContext.Provider value={{
      addImageAsset,
      addVideoAsset,
      onAssetLoaded,
      allLoaded: done,
    }}>
      {props.children}
    </AssetsLoaderContext.Provider>
  );
};

export default AssetsLoaderProvider;

export interface AssetsLoaderContextProps {
  addImageAsset(cb: AddAssetCb<HTMLImageElement>): Promise<HTMLImageElement>;
  addVideoAsset(cb: AddAssetCb<HTMLVideoElement>): Promise<HTMLVideoElement>;
  onAssetLoaded(): void;
  allLoaded: boolean;
}

type AddAssetCb<El> = (htmlElement: El) => void;

type Resolvers = Resolver<HTMLImageElement> | Resolver<HTMLVideoElement>;

interface Resolver<T extends HTMLElement> {
  [assetUrl: string]: {
    resolve: (value: T | PromiseLike<T>) => void;
    el: T;
  }
}
