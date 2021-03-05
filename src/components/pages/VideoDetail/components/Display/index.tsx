import * as i from 'types';
import React from 'react';

import { isRef } from 'services/typeguards';

import { Video } from './styled';


const Display = React.forwardRef<HTMLVideoElement, Props>((_props, ref) => {
  // Dirty type fix
  const props = _props as ClonedProps;

  React.useEffect(() => {
    if (!isRef<HTMLVideoElement>(ref)) {
      return;
    }

    const video = ref.current;

    if (video.paused && props.controls.playing) {
      video.play();
    } else if (!video.paused && !props.controls.playing) {
      video.pause();
    }
  }, [props.controls.playing]);

  return (
    <Video
      ref={ref}
      height={window.innerHeight - 50}
      src={CMS_URL + props.videoObject.full_video?.url}
    />
  );
});

interface Props {
  videoObject: i.APIMediaObject;
}

interface ClonedProps extends Props {
  controls: {
    playing: boolean;
    started: boolean;
    volume: number;
  };
}

export default Display;
