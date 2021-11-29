import React from 'react';

import useStore from 'state';
import PlaySvg from 'vectors/play-solid.svg';
import PauseSvg from 'vectors/pause-solid.svg';

import { useEventListener } from 'hooks';

import Seekbar from '../Seekbar';
import Volume from '../Volume';
import Fullscreen from '../Fullscreen';
import {
  ControlsGridContainer, ControlsGrid, PlayerControlsContainer, PlayPauseIcon, VideoArea,
} from './styled';


let timeoutId = -1;

const PlayerControls: React.FC<Props> = (props) => {
  const state = useStore();
  const [visible, setVisible] = React.useState({
    play: true,
    other: true,
  });
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    handleAutoHide();

    return function cleanup() {
      clearTimeout(timeoutId);
    };
  }, []);

  useEventListener('mouseover', setAllVisible, gridRef.current);
  useEventListener('mouseout', setAllInvisible, gridRef.current);
  useEventListener('pause', setOtherInvisible, props.videoRef?.current);
  useEventListener('play', setOtherVisible, props.videoRef?.current);
  useEventListener('mousemove', handleMouseMove, gridRef.current);

  function handleAutoHide() {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      if (!props.videoRef?.current?.paused) {
        setVisible({
          play: false,
          other: false,
        });
      }
    }, 5000);
  }

  function handleMouseMove() {
    if (!props.videoRef?.current?.paused) {
      setVisible({
        play: true,
        other: true,
      });
    }

    handleAutoHide();
  }

  function setAllVisible() {
    setVisible({
      play: true,
      other: !props.videoRef?.current?.paused,
    });
  }

  function setAllInvisible() {
    setVisible({
      play: !!props.videoRef?.current?.paused,
      other: false,
    });
  }

  function setOtherInvisible() {
    setVisible({
      play: true,
      other: false,
    });
  }

  function setOtherVisible() {
    setVisible({
      play: true,
      other: true,
    });
  }

  function onPlayPauseClick() {
    if (state.videoPlayer.isPlaying) {
      state.videoPlayer.setPlaying(false);
    } else {
      state.videoPlayer.setPlaying(true);
    }
  }

  return (
    <PlayerControlsContainer hideCursor={!visible.play}>
      {props.children}
      {props.width != null && props.width > 0 && (
        <ControlsGridContainer id="controls-grid">
          <ControlsGrid ref={gridRef} maxWidth={props.width}>
            <VideoArea onClick={onPlayPauseClick} />

            <PlayPauseIcon onClick={onPlayPauseClick} visible={visible.play}>
              {state.videoPlayer.isPlaying ? <PauseSvg /> : <PlaySvg />}
            </PlayPauseIcon>

            <Seekbar videoRef={props.videoRef} visible={visible.other} />
            <Volume videoRef={props.videoRef} visible={visible.other} />
            <Fullscreen videoRef={props.videoRef} visible={visible.other} />
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
