import * as i from 'types';
import React from 'react';
import { useLocation } from 'react-location';
import shallow from 'zustand/shallow';

import useStore, { selectors } from 'state';
import { useAnimationFrame, useEventListener, usePrevious } from 'hooks';
import { drawCoverFitImage, drawCoverFitVideo } from 'services';
import { isVideo, isPhoto } from 'services/typeguards';
import { AssetsLoaderContext } from 'context/assetsLoaderProvider';

import MediaTitleOverlay from 'pages/Home/components/MediaTitleOverlay';
import FullscreenCanvas from 'common/presentation/FullscreenCanvas';

interface Media<T extends HTMLVideoElement | HTMLImageElement> {
  [id: number]: i.APIMediaObject & {
    element: T;
  }
}

// React setState can't keep up with high screen refresh rates or quick changes to heavy objects
// We also don't need these variables to fire renders
let dividerPos = 0;
let startPos = 0;
let startTime = 0;
let transitionStartTime = 0;
let prevPhoto: i.APIMediaObject | undefined;
let prevVideo: i.APIMediaObject | undefined;

// We keep all videos and photos in memory with these objects for super fast switching between
// different photos/films
const videos: Media<HTMLVideoElement> = {};
const photos: Media<HTMLImageElement> = {};


const RenderCanvas: React.VFC<Props> = (props) => {
  const {
    setLoading: setAppLoading, isFullscreen: isCanvasFullscreen, isAnyMenuOpen, setMenuOpen,
    closeMenus, showName, setShowName,
  } = useStore(selectors.ui, shallow);
  const {
    photo: statePhoto, video: stateVideo, allMedia: allStateMedia,
  } = useStore(selectors.media, shallow);
  const location = useLocation();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const tempPrevPhoto = usePrevious(statePhoto);
  const tempPrevVideo = usePrevious(stateVideo);
  const [sizeData, setSizeData] = React.useState<i.SizeData>({
    L: null,
    R: null,
  });
  const prevSideSize = usePrevious(sizeData);
  const loader = React.useContext(AssetsLoaderContext);

  React.useEffect(() => {
    if (loader?.allLoaded) {
      setTimeout(() => {
        setAppLoading(false);
      }, 1000);
    }
  }, [loader?.allLoaded, setAppLoading]);

  // Ugly but works for now :)
  function mediaTransition(ctx: CanvasRenderingContext2D, mediaType: i.MediaType, timestamp: number) {
    if (!statePhoto || !stateVideo) {
      return;
    }

    const collection = mediaType === 'photo' ? photos : videos;
    const media = mediaType === 'photo' ? photos[statePhoto.id] : videos[stateVideo.id];
    const prevMedia = mediaType === 'photo' ? prevPhoto : prevVideo;

    if (!media) {
      return;
    }

    if (transitionStartTime === 0 && prevMedia!.id !== media.id) {
      transitionStartTime = timestamp;
    }

    if (transitionStartTime > 0) {
      const duration = 300;
      const runtime = timestamp - transitionStartTime;
      const absoluteProgress = Math.min(runtime / duration, 1);
      const alpha1 = 1 - absoluteProgress;
      const alpha2 = absoluteProgress;

      ctx.globalAlpha = alpha1;

      if (mediaType === 'video') {
        let x = dividerPos;

        if (props.fullscreen === 'video') {
          x = 0;
        }

        drawCoverFitVideo(
          ctx,
          collection[prevMedia!.id]!.element as HTMLVideoElement,
          x,
        );
      } else {
        let width = Math.min(dividerPos, window.innerWidth);

        if (props.fullscreen === 'photo') {
          width = window.innerWidth;
        }

        drawCoverFitImage(
          ctx,
          collection[prevMedia!.id]!.element as HTMLImageElement,
          width,
          ctx.canvas.height,
        );
      }

      ctx.globalAlpha = alpha2;

      if (absoluteProgress === 1) {
        transitionStartTime = 0;
        prevVideo = undefined;
        prevPhoto = undefined;
      }
    }
  }

  // Rendering the canvas
  useAnimationFrame(((animProps) => {
    const timestamp = animProps.time;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!props.visible || !canvas || !ctx) {
      return;
    }

    // Clear all canvas pixels
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Start in the middle
    let dividerOffset = 0.5;

    switch (sizeData.L) {
      case 'large': dividerOffset = 0.75; break;
      case 'full': dividerOffset = 1; break;
    }
    switch (sizeData.R) {
      case 'large': dividerOffset = 0.25; break;
      case 'full': dividerOffset = 0; break;
    }

    // Animation start
    if (prevSideSize) {
      if (sizeData.L !== prevSideSize.L || sizeData.R !== prevSideSize.R) {
        startTime = timestamp;
        startPos = dividerPos;
      }
    }

    // Animate position of divider
    if (startTime > 0) {
      const duration = 1000;
      const runtime = timestamp - startTime;
      const targetPos = canvas.width * dividerOffset;
      const dist = targetPos - startPos;

      dividerPos = easeOutQuart(runtime / 1000, startPos, dist, duration / 1000);

      // Done
      if (runtime >= duration) {
        startTime = 0;
      }
    }

    if (stateVideo && props.fullscreen !== 'photo') {
      const video = videos[stateVideo.id];

      // Don't render video if photo is fullscreen
      if (video && dividerPos !== window.innerWidth) {
        if (prevVideo) {
          mediaTransition(ctx, 'video', timestamp);
        }

        let x = dividerPos;

        if (props.fullscreen === 'video') {
          x = 0;
        }

        drawCoverFitVideo(ctx, video.element, x);
      }
    }

    if (statePhoto && props.fullscreen !== 'video') {
      const photo = photos[statePhoto.id];

      // Don't render photo if video is fullscreen
      if (photo && dividerPos !== 0) {
        if (prevPhoto) {
          mediaTransition(ctx, 'photo', timestamp);
        }

        let width = Math.min(dividerPos, window.innerWidth);

        if (props.fullscreen === 'photo') {
          width = window.innerWidth;
        }

        drawCoverFitImage(
          ctx,
          photo.element,
          width,
          canvas.height,
        );
      }
    }
  }), [sizeData, statePhoto, stateVideo, props.fullscreen, props.visible]);

  // Add mouseover events
  useEventListener('mousemove', (e: MouseEvent) => {
    if (props.fullscreen) {
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;

    // Left side
    if (e.clientX < canvas.width * 0.3) {
      setSizeData((prev) => ({
        ...prev,
        L: isCanvasFullscreen ? 'full' : 'large',
      }));
    // Right side
    } else if (e.clientX > canvas.width * 0.7) {
      setSizeData((prev) => ({
        ...prev,
        R: isCanvasFullscreen ? 'full' : 'large',
      }));
    } else {
      setSizeData({
        L: null,
        R: null,
      });
    }
  });

  React.useEffect(() => {
    if (location.current.pathname !== '/') {
      return;
    }

    if (!isAnyMenuOpen()) {
      if (sizeData.L) {
        setMenuOpen('L', true);
      } else if (sizeData.R) {
        setMenuOpen('R', true);
      }
    } else if (!sizeData.L && !sizeData.R) {
      closeMenus();
    }
  }, [sizeData.L, sizeData.R, isAnyMenuOpen, setMenuOpen, closeMenus]);

  // Init photo/video into memory
  React.useEffect(() => {
    if (!allStateMedia) {
      return;
    }

    if (Object.keys(videos).length > 0 || Object.keys(photos).length > 0) {
      return;
    }

    for (let i = 0; i < Math.max(allStateMedia.video.length, allStateMedia.photo.length); i++) {
      const videoData = allStateMedia.video[i];
      const videoMedia = videoData?.media_cover;

      if (videoData && isVideo(videoMedia)) {
        loader?.addVideoAsset((video) => {
          video.src = CMS_URL + videoMedia.url;
          video.autoplay = true;
          video.loop = true;
          video.muted = true;

          videos[videoData.id] = {
            ...videoData,
            element: video,
          };
        });
      }

      const photoData = allStateMedia.photo[i];
      const photoMedia = photoData?.media_cover;

      if (photoData && isPhoto(photoMedia)) {
        loader?.addImageAsset((img) => {
          img.src = CMS_URL + photoMedia.url;

          photos[photoData.id] = {
            ...photoData,
            element: img,
          };
        });
      }
    }
  }, [allStateMedia, loader?.allLoaded]);

  // Show "bedroom" title
  React.useEffect(() => {
    if (location.current.pathname !== '/') {
      return;
    }

    if (isCanvasFullscreen && showName) {
      setShowName(false);
    } else if (!isCanvasFullscreen && !showName) {
      setShowName(true);
    }
  }, [location.current.pathname, isCanvasFullscreen, showName, setShowName]);

  // Used for transitions between media
  React.useEffect(() => {
    prevPhoto = tempPrevPhoto;
  }, [statePhoto]);

  React.useEffect(() => {
    prevVideo = tempPrevVideo;
  }, [stateVideo]);

  // Init divider position
  React.useEffect(() => {
    if (location.current.pathname === '/') {
      dividerPos = canvasRef.current!.width * 0.5;
    }
  }, [canvasRef.current, location.current.pathname]);

  return (
    <>
      <FullscreenCanvas ref={canvasRef} visible={props.visible} />
      <MediaTitleOverlay />
    </>
  );
};

RenderCanvas.defaultProps = {
  visible: true,
};

interface Props {
  fullscreen?: i.MediaType;
  visible?: boolean;
}

function easeOutQuart(t: number, b: number, c: number, d: number): number {
  return -c * ((t = t / d - 1) * t * t * t - 1) + b;
}

export default RenderCanvas;
