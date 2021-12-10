import * as i from 'types';
import React from 'react';
import { useLocation } from 'react-location';

import { useAnimationFrame, useEventListener, usePrevious, useShallowStore } from 'hooks';
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
  const ui = useShallowStore(
    'ui',
    ['isFullscreen', 'isAnyMenuOpen', 'setMenuOpen', 'closeMenus', 'showName', 'setShowName',
      'setLoading'],
  );
  const stateMedia = useShallowStore('media', ['photo', 'video', 'allMedia']);
  const location = useLocation();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const tempPrevPhoto = usePrevious(stateMedia.photo);
  const tempPrevVideo = usePrevious(stateMedia.video);
  const [sizeData, setSizeData] = React.useState<i.SizeData>({
    L: null,
    R: null,
  });
  const prevSideSize = usePrevious(sizeData);
  const loader = React.useContext(AssetsLoaderContext);

  React.useEffect(() => {
    if (loader?.allLoaded) {
      setTimeout(() => {
        ui.setLoading(false);
      }, 1000);
    }
  }, [loader?.allLoaded, ui.setLoading]);

  // Ugly but works for now :)
  const mediaTransition = React.useCallback((ctx: CanvasRenderingContext2D, mediaType: i.MediaType, timestamp: number) => {
    if (!stateMedia.photo || !stateMedia.video) {
      return;
    }

    const collection = mediaType === 'photo' ? photos : videos;
    const media = mediaType === 'photo' ? photos[stateMedia.photo.id] : videos[stateMedia.video.id];
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
  }, [stateMedia.photo, stateMedia.video, props.fullscreen]);

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

    if (stateMedia.video && props.fullscreen !== 'photo') {
      const video = videos[stateMedia.video.id];

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

    if (stateMedia.photo && props.fullscreen !== 'video') {
      const photo = photos[stateMedia.photo.id];

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
  }), [sizeData, stateMedia.photo, stateMedia.video, props.fullscreen, props.visible]);

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
        L: ui.isFullscreen ? 'full' : 'large',
      }));
    // Right side
    } else if (e.clientX > canvas.width * 0.7) {
      setSizeData((prev) => ({
        ...prev,
        R: ui.isFullscreen ? 'full' : 'large',
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

    if (!ui.isAnyMenuOpen()) {
      if (sizeData.L) {
        ui.setMenuOpen('L', true);
      } else if (sizeData.R) {
        ui.setMenuOpen('R', true);
      }
    } else if (!sizeData.L && !sizeData.R) {
      ui.closeMenus();
    }
  }, [sizeData.L, sizeData.R, ui.isAnyMenuOpen, ui.setMenuOpen, ui.closeMenus]);

  // Init photo/video into memory
  React.useEffect(() => {
    if (!stateMedia.allMedia) {
      return;
    }

    if (Object.keys(videos).length > 0 || Object.keys(photos).length > 0) {
      return;
    }

    for (let i = 0; i < Math.max(stateMedia.allMedia.video.length, stateMedia.allMedia.photo.length); i++) {
      const videoData = stateMedia.allMedia.video[i];
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

      const photoData = stateMedia.allMedia.photo[i];
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
  }, [stateMedia.allMedia, loader?.allLoaded]);

  // Show "bedroom" title
  React.useEffect(() => {
    if (location.current.pathname !== '/') {
      return;
    }

    if (ui.isFullscreen && ui.showName) {
      ui.setShowName(false);
    } else if (!ui.isFullscreen && !ui.showName) {
      ui.setShowName(true);
    }
  }, [location.current.pathname, ui.isFullscreen, ui.showName, ui.setShowName]);

  // Used for transitions between media
  React.useEffect(() => {
    prevPhoto = tempPrevPhoto;
  }, [stateMedia.photo]);

  React.useEffect(() => {
    prevVideo = tempPrevVideo;
  }, [stateMedia.video]);

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
