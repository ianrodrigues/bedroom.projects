import React from 'react';

import { isHTMLVideoElement } from 'services/typeguards';


export type AssetsLoaderContextProps = {
  addImageAsset(cb: AddAssetCb<HTMLImageElement>): Promise<HTMLImageElement>;
  addVideoAsset(cb: AddAssetCb<HTMLVideoElement>): Promise<HTMLVideoElement>;
  onAssetLoaded(): void;
  allLoaded: boolean;
};

type AddAssetCb<El> = (htmlElement: El) => void;

export const AssetsLoaderContext = React.createContext<AssetsLoaderContextProps>(
  {} as AssetsLoaderContextProps,
);

const AssetsLoaderProvider: React.FC = (props) => {
  const [amount, setAmount] = React.useState(0);
  const [amountLoaded, setAmountLoaded] = React.useState(0);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (done) {
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

  async function addImageAsset(cb: AddAssetCb<HTMLImageElement>): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      AddAsset();

      const img = document.createElement('img');
      cb(img);

      function onLoad() {
        onAssetLoaded();
        img.removeEventListener('load', onLoad);
        resolve(img);
      }

      img.addEventListener('load', onLoad);
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
