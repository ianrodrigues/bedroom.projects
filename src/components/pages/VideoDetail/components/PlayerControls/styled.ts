import styled, { css } from 'styled-components';


export const PlayerControlsContainer = styled.div<PlayerControlsContainerProps>((props) => css`
  position: relative;
  width: 100%;
  height: ${window.innerHeight - 50}px;
`);

interface PlayerControlsContainerProps {
  $height?: number;
}

export const ControlsGridContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 100%;
`;

export const ControlsGrid = styled.div<ControlsGridProps>((props) => css`
  display: grid;
  grid-template-columns: 70px 1fr 70px 70px;
  grid-template-rows: 1fr 60px;
  gap: 0px 10px;
  grid-template-areas:
    "display display display display"
    "play seekbar volume fullscreen";
  justify-items: center;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  max-width: ${props.maxWidth}px;
`);

interface ControlsGridProps {
  maxWidth?: number;
}

export const VideoArea = styled.div`
  grid-column-start: display-start;
  grid-column-end: display-end;
  grid-row: 1;
  width: 100%;
  height: 100%;
`;

export const PlayPauseIcon = styled.div`
  grid-area: play;
  height: 15px;
  mix-blend-mode: difference;

  svg {
    position: relative;
    height: 100%;

    path {
      fill: #fff;
    }
  }
`;

export const SeekbarContainer = styled.div`
  grid-area: seekbar;
  position: relative;
  width: 100%;
  height: 5px;
  background-color: #2d2b2b;
  mix-blend-mode: difference;
`;

export const SeekbarInner = styled.div.attrs<ProgressProps>((props) => ({
  style: {
    transform: `scaleX(${props.progress})`,
  },
}))<ProgressProps>`
  height: 100%;
  width: 100%;
  transform-origin: left;
  background-color: #fff;
  transition: transform 100ms;
`;

export const SeekbarTimeIndicator = styled.span.attrs<ProgressProps>((props) => ({
  style: {
    left: `${props.progress}%`,
  },
}))<ProgressProps>`
  position: absolute;
  top: 50%;
  transform: translate3d(-50%, -150%, 0);
  pointer-events: none;
  font-family: 'Roboto', sans-serif;
  transition: left 100ms;
`;

interface ProgressProps {
  progress: number;
}
