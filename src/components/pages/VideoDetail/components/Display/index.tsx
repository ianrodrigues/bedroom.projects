import * as i from 'types';
import React from 'react';

import { Video } from './styled';


const Display = React.forwardRef<HTMLVideoElement, Props>((props, ref) => {
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

export default Display;
