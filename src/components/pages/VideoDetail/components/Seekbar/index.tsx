import React from 'react';
import { useLocation } from 'react-router';

import { SeekbarContainer, SeekbarInner, SeekbarTimeIndicator } from './styled';


const Seekbar: React.VFC<Props> = (props) => {
  const location = useLocation();
  const [progress, setProgress] = React.useState(0);
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    setProgress(0);
    setTime(0);
  }, [location.pathname]);

  React.useEffect(() => {
    const video = props.videoRef?.current;

    if (!video) {
      return;
    }

    video.addEventListener('timeupdate', onTimeUpdate);

    return function cleanup() {
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [props.videoRef]);

  function onTimeUpdate(this: HTMLVideoElement) {
    const duration = this.duration;
    const curTime = this.currentTime;
    const progress = curTime / duration;

    setProgress(progress);
    setTime(curTime);
  }

  function getTimestamp() {
    let minutes: string | number = Math.floor(time / 60);
    let seconds: string | number = Math.floor(time % 60);

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return `${minutes}:${seconds}`;
  }

  return (
    <SeekbarContainer>
      <SeekbarTimeIndicator progress={progress * 100}>
        {getTimestamp()}
      </SeekbarTimeIndicator>
      <SeekbarInner progress={progress} />
    </SeekbarContainer>
  );
};

export type Props = {
  videoRef?: React.RefObject<HTMLVideoElement>;
};

export default Seekbar;
