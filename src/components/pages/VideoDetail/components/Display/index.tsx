import * as i from 'types';
import React from 'react';

import { useEventListener, useShallowStore } from 'hooks';

import { Video } from './styled';


const Display = React.forwardRef<HTMLVideoElement, Props>((props, ref) => {
  const ui = useShallowStore('ui', ['interacted']);
  const [videoSize, setVideoSize] = React.useState(window.innerHeight - 50);

  useEventListener('resize', () => {
    setVideoSize(window.innerHeight - 50);
  });

  return (
    <Video
      ref={ref}
      height={videoSize}
      src={CMS_URL + props.videoObject.full_video?.url}
      poster={CMS_URL + props.videoObject.video_poster?.url}
      disablePictureInPicture
      loop
      muted={!ui.interacted}
    />
  );
});

interface Props {
  videoObject: i.APIMediaObject;
}

export default Display;
