import * as i from 'types';
import React from 'react';
import { useLocation } from 'react-router';

import useStore from 'state';
import { useAnimationFrame, useEventListener, usePrevious } from 'hooks';
import { drawCoverFitImage, drawCoverFitVideo } from 'services';
import { isVideo, isPhoto, isHTMLVideoElement } from 'services/typeguards';

import MediaOverlay from 'pages/Home/components/MediaOverlay';
import FullscreenCanvas from 'common/presentation/FullscreenCanvas';

interface Media<T extends HTMLVideoElement | HTMLImageElement> {
  [id: number]: i.APIMediaObject & {
    element: T;
  }
}

// React setState can't keep up with high screen refresh rates or quick changes to heavy objects
// We also don't need these variables to fire renders
let dividerPos = 0;
let startTime = 0;
let transitionStartTime = 0;
let prevPhoto: i.APIMediaObject | undefined;
let prevVideo: i.APIMediaObject | undefined;
let loaded = 0;

// We keep all videos and photos in memory with these objects for super fast switching between
// different photos/films
const videos: Media<HTMLVideoElement> = {};
const photos: Media<HTMLImageElement> = {};


const RenderCanvas: React.VFC<Props> = (props) => {
  const state = useStore();
  const location = useLocation();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const tempPrevPhoto = usePrevious(state.photo);
  const tempPrevVideo = usePrevious(state.video);
  const [sizeData, setSizeData] = React.useState<i.SizeData>({
    L: null,
    R: null,
  });
  const prevSideSize = usePrevious(sizeData);

  // Ugly but works for now :)
  function mediaTransition(ctx: CanvasRenderingContext2D, mediaType: i.MediaType, timestamp: number) {
    if (!state.photo || !state.video) {
      return;
    }

    const collection = mediaType === 'photo' ? photos : videos;
    const media = mediaType === 'photo' ? photos[state.photo.id] : videos[state.video.id];
    const prevMedia = mediaType === 'photo' ? prevPhoto : prevVideo;

    if (!media) {
      return;
    }

    if (transitionStartTime === 0 && prevMedia!.id !== media.id) {
      transitionStartTime = timestamp;
    }

    if (transitionStartTime > 0) {
      const duration = .4;
      const runtime = timestamp - transitionStartTime;
      const relativeProgress = Math.min(runtime / duration, 1);
      const alpha1 = 1 - relativeProgress;
      const alpha2 = relativeProgress;

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

      if (relativeProgress === 1) {
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

    if (!props.show || !canvas || !ctx) {
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
      }
    }

    // Animate position of divider
    if (startTime > 0) {
      const duration = 1.25;
      const targetPos = canvas.width * dividerOffset;
      const runtime = timestamp - startTime;
      const distance = targetPos - dividerPos;
      const absoluteProgress = Math.min(runtime / duration, 1);
      const ease = -(Math.cos(Math.PI * absoluteProgress) - 1) / 2;
      const relativeDistance = ease * Math.abs(distance);

      if (distance >= 0) {
        dividerPos += relativeDistance;
      } else {
        dividerPos -= relativeDistance;
      }

      // Done
      if (absoluteProgress === 1) {
        startTime = 0;
      }
    }

    if (state.video && props.fullscreen !== 'photo') {
      const video = videos[state.video.id];

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

    if (state.photo && props.fullscreen !== 'video') {
      const photo = photos[state.photo.id];

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
  }), [sizeData, state.photo, state.video, props.fullscreen, props.show]);

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
        L: state.isFullscreen ? 'full' : 'large',
      }));
    // Right side
    } else if (e.clientX > canvas.width * 0.7) {
      setSizeData((prev) => ({
        ...prev,
        R: state.isFullscreen ? 'full' : 'large',
      }));
    } else {
      setSizeData({
        L: null,
        R: null,
      });
    }
  });

  React.useEffect(() => {
    if (location.pathname !== '/') {
      return;
    }

    if (!state.isAnyMenuOpen()) {
      if (sizeData.L) {
        state.setMenuOpen('L', true);
      } else if (sizeData.R) {
        state.setMenuOpen('R', true);
      }
    } else if (!sizeData.L && !sizeData.R) {
      state.closeMenus();
    }
  }, [sizeData.L, sizeData.R]);

  // Init photo/video into memory
  React.useEffect(() => {
    if (!state.allMedia) {
      return;
    }

    if (Object.keys(videos).length > 0 || Object.keys(photos).length > 0) {
      return;
    }

    for (let i = 0; i < Math.max(state.allMedia.video.length, state.allMedia.photo.length); i++) {
      const videoData = state.allMedia.video[i];
      const videoMedia = videoData?.media_cover;

      if (videoData && isVideo(videoMedia)) {
        const video = document.createElement('video');
        video.oncanplaythrough = handleMediaLoaded;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.src = CMS_URL + videoMedia.url;

        videos[videoData.id] = {
          ...videoData,
          element: video,
        };
      }

      const photoData = state.allMedia.photo[i];
      const photoMedia = photoData?.media_cover;

      if (photoData && isPhoto(photoMedia)) {
        const img = document.createElement('img');
        img.onload = handleMediaLoaded;
        img.src = CMS_URL + photoMedia.url;

        photos[photoData.id] = {
          ...photoData,
          element: img,
        };
      }
    }
  }, [state.allMedia]);

  // Show "bedroom" title
  React.useEffect(() => {
    if (location.pathname !== '/') {
      return;
    }

    if (state.isFullscreen && state.showName) {
      state.setShowName(false);
    } else if (!state.isFullscreen && !state.showName) {
      state.setShowName(true);
    }
  }, [state.isFullscreen]);

  // Used for transitions between media
  React.useEffect(() => {
    prevPhoto = tempPrevPhoto;
  }, [state.photo]);

  React.useEffect(() => {
    prevVideo = tempPrevVideo;
  }, [state.video]);

  // Init divider position
  React.useEffect(() => {
    dividerPos = canvasRef.current!.width * 0.5;
  }, [canvasRef, location.pathname]);

  function handleMediaLoaded(this: GlobalEventHandlers) {
    const maxLoaded = Object.keys(videos).length + Object.keys(photos).length;
    loaded++;

    if (loaded === maxLoaded) {
      setTimeout(() => {
        state.setLoading(false);
      }, 1000);
    }

    // Chrome muted autoplay bugfix
    if (isHTMLVideoElement(this)) {
      this.muted = true;
      this.play();
    }
  }

  return (
    <>
      <FullscreenCanvas ref={canvasRef} show={props.show} />
      <MediaOverlay />
    </>
  );
};

RenderCanvas.defaultProps = {
  show: true,
};

interface Props {
  fullscreen?: 'photo' | 'video';
  show?: boolean;
}

export default RenderCanvas;
