import React from 'react';
import { useLocation } from 'react-router';

import useStore from 'state';
import PlaySvg from 'vectors/play-solid.svg';
import PauseSvg from 'vectors/pause-solid.svg';

import {
  ControlsGridContainer, ControlsGrid, PlayerControlsContainer, PlayPauseIcon, VideoArea,
  SeekbarContainer, SeekbarInner, SeekbarTimeIndicator,
} from './styled';


const PlayerControls: React.FC<Props> = (props) => {
  const state = useStore();
  const location = useLocation();
  const [progress, setProgress] = React.useState(0);
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    setProgress(0);
    setTime(0);
    state.videoPlayer.setPlaying(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (!props.videoRef?.current) {
      return;
    }

    const video = props.videoRef.current;
    video.addEventListener('timeupdate', onTimeUpdate);

    return function cleanup() {
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [props.videoRef]);

  function onPlayPauseClick() {
    if (state.videoPlayer.isPlaying) {
      state.videoPlayer.setPlaying(false);
    } else {
      state.videoPlayer.setPlaying(true);
    }
  }

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
    <PlayerControlsContainer>
      {props.children}
      {props.width != null && props.width > 0 && (
        <ControlsGridContainer>
          <ControlsGrid maxWidth={props.width}>
            <VideoArea onClick={onPlayPauseClick} />
            <PlayPauseIcon onClick={onPlayPauseClick}>
              {state.videoPlayer.isPlaying ? <PauseSvg /> : <PlaySvg />}
            </PlayPauseIcon>

            <SeekbarContainer>
              <SeekbarTimeIndicator progress={progress * 100}>
                {getTimestamp()}
              </SeekbarTimeIndicator>
              <SeekbarInner progress={progress} />
            </SeekbarContainer>
          </ControlsGrid>
        </ControlsGridContainer>
      )}
    </PlayerControlsContainer>
  );
};

export type Props = {
  width?: number;
  height?: number;
  videoRef?: React.RefObject<HTMLVideoElement>;
  children: React.ReactElement;
};

export default PlayerControls;
