import React from 'react';

import useStore from 'state';
import PlaySvg from 'vectors/play-solid.svg';
import PauseSvg from 'vectors/pause-solid.svg';

import Seekbar from '../Seekbar';
import {
  ControlsGridContainer, ControlsGrid, PlayerControlsContainer, PlayPauseIcon, VideoArea,
} from './styled';


const PlayerControls: React.FC<Props> = (props) => {
  const state = useStore();

  function onPlayPauseClick() {
    if (state.videoPlayer.isPlaying) {
      state.videoPlayer.setPlaying(false);
    } else {
      state.videoPlayer.setPlaying(true);
    }
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

            <Seekbar videoRef={props.videoRef} />
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
