import * as i from 'types';
import React from 'react';

import useStore from 'state';
import { isRef } from 'services/typeguards';

import { Video } from './styled';


const Display = React.forwardRef<HTMLVideoElement, Props>((_props, ref) => {
  const state = useStore();

  // Dirty type fix
  const props = _props as ClonedProps;

  React.useEffect(() => {
    if (!isRef<HTMLVideoElement>(ref)) {
      return;
    }

    const video = ref.current;

    if (video.paused && state.videoPlayer.isPlaying) {
      video.play();
    } else if (!video.paused && !state.videoPlayer.isPlaying) {
      video.pause();
    }
  }, [state.videoPlayer.isPlaying]);

  React.useEffect(() => {
    if (!isRef<HTMLVideoElement>(ref)) {
      return;
    }

    const video = ref.current;

    video.addEventListener('timeupdate', props.onTimeUpdate);

    return function cleanup() {
      video.removeEventListener('timeupdate', props.onTimeUpdate);
    };
  }, [ref]);

  return (
    <Video
      ref={ref}
      height={window.innerHeight - 50}
      src={CMS_URL + props.videoObject.full_video?.url}
      poster={CMS_URL + props.videoObject.video_poster?.url}
    />
  );
});

interface Props {
  videoObject: i.APIMediaObject;
}

interface ClonedProps extends Props {
  onTimeUpdate: (event: Event) => void;
}

export default Display;
