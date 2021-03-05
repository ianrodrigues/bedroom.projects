import React from 'react';

import PlaySvg from 'vectors/play-solid.svg';
import PauseSvg from 'vectors/pause-solid.svg';
import useControls from '../Player/useControls';

import { ControlsGrid, PlayerControlsContainer, PlayPauseIcon, VideoArea } from './styled';


const PlayerControls: React.FC<Props> = (props) => {
  const controls = useControls();

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

  return (
    <PlayerControlsContainer $width={props.width} $height={props.height}>
      {React.cloneElement(props.children, { controls })}
      <ControlsGrid>
        <VideoArea onClick={onPlayPauseClick} />
        <PlayPauseIcon onClick={onPlayPauseClick}>
          {controls.playing ? <PauseSvg /> : <PlaySvg />}
        </PlayPauseIcon>
      </ControlsGrid>
    </PlayerControlsContainer>
  );
};

export type Props = {
  width?: number;
  height?: number;
  children: React.ReactElement;
};

export default PlayerControls;
