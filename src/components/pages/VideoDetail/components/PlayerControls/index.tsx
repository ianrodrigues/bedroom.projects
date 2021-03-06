import React from 'react';
import { useLocation } from 'react-router';

import PlaySvg from 'vectors/play-solid.svg';
import PauseSvg from 'vectors/pause-solid.svg';

import useControls from './useControls';
import {
  ControlsGridContainer, ControlsGrid, PlayerControlsContainer, PlayPauseIcon, VideoArea,
  SeekbarContainer, SeekbarInner, SeekbarTimeIndicator,
} from './styled';


const PlayerControls: React.FC<Props> = (props) => {
  const controls = useControls();
  const location = useLocation();
  const [progress, setProgress] = React.useState(0);
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    setProgress(0);
    setTime(0);
    controls.setStarted(false);
    controls.setPlaying(false);
  }, [location.pathname]);

  function onPlayPauseClick() {
    if (controls.playing) {
      controls.setPlaying(false);
    } else {
      if (!controls.started) {
        controls.setStarted(true);
      }

      controls.setPlaying(true);
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

  console.log(props.width);

  return (
    <PlayerControlsContainer>
      {React.cloneElement(props.children, { controls, onTimeUpdate })}

      {props.width != null && props.width > 0 && (
        <ControlsGridContainer>
          <ControlsGrid maxWidth={props.width}>
            <VideoArea onClick={onPlayPauseClick} />
            <PlayPauseIcon onClick={onPlayPauseClick}>
              {controls.playing ? <PauseSvg /> : <PlaySvg />}
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
  children: React.ReactElement;
};

export default PlayerControls;
