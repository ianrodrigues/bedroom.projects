import * as i from 'types';
import React from 'react';

import { isHTMLVideoElement } from 'services/typeguards';
import AssetLoaderWorker from 'workers/AssetLoader?worker';


export const AssetsLoaderContext = React.createContext<AssetsLoaderContextProps | null>(null);

// Web Worker to load images in a different thread from UI
const assetLoaderWorker = new AssetLoaderWorker();

// Keep track of URLs that we have already loaded
const loadedList: Record<string, boolean> = {};

// Store Promise resolvers: workers can not clone these constructs, so we store them here
const resolvers = {} as Resolvers;


const AssetsLoaderProvider: React.FC = (props) => {
  const [amount, setAmount] = React.useState(0);
  const [amountLoaded, setAmountLoaded] = React.useState(0);
  const [done, setDone] = React.useState(false);

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

  function AddAsset(url: string): { loaded: boolean } {
    // Invalid url
    if (url.length === 0) {
      return { loaded: true };
    }

    setDone(false);
    setAmount((amt) => amt + 1);

    // If src in memory is done, we return
    if (loadedList[url]) {
      onAssetLoaded(url);

      return { loaded: true };
    }

    // Add src to memory
    loadedList[url] = false;

    return { loaded: false };
  }

  function onAssetLoaded(url: string) {
    setAmountLoaded((amt) => amt + 1);
    loadedList[url] = true;
  }

  async function onWorkerDone(evt: MessageEvent<i.AssetLoaderWorkerMessage>) {
    const { url } = evt.data;

    // +1 assets loaded
    onAssetLoaded(url);

    // Resolve the promise for this URL with its element
    resolvers[url]?.resolve(resolvers[url]!.el as HTMLImageElement);

    // Remove from memory
    delete resolvers[url];
  }

  async function addImageAsset(cb: AddAssetCb<HTMLImageElement>): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = document.createElement('img');

      // Let callback do stuff with img element
      cb(img);


      const { loaded } = AddAsset(img.src);

      if (loaded) {
        return resolve(img);
      }


      // Dev server web worker only works in Chrome
      if (__PROD__ || (__DEV__ && 'chrome' in window)) {
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
          onAssetLoaded(img.src);
          img.removeEventListener('load', onLoad);
          resolve(img);
        }

        img.addEventListener('load', onLoad);
      }
    });
  }

  function addVideoAsset(cb: AddAssetCb<HTMLVideoElement>): Promise<HTMLVideoElement> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.muted = true;

      // Let callback do stuff with video element
      cb(video);


      const { loaded } = AddAsset(video.src);

      if (loaded) {
        return resolve(video);
      }


      function onCanPlay(this: GlobalEventHandlers) {
        if (isHTMLVideoElement(this)) {
          onAssetLoaded(this.src);
          this.removeEventListener('canplay', onCanPlay);
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
  allLoaded: boolean;
}

type AddAssetCb<El> = (htmlElement: El) => void;

// @TODO only images are supported atm
type Resolvers = Resolver<HTMLImageElement>; // | Resolver<HTMLVideoElement>;

interface Resolver<T extends HTMLElement> {
  [assetUrl: string]: {
    resolve: (value: T | PromiseLike<T>) => void;
    el: T;
  }
}
