import styled, { css } from 'styled-components';


export const PlayerControlsContainer = styled.div<PlayerControlsContainerProps>((props) => css`
  position: relative;
  width: 100%;
  height: calc(100vh - 50px);

  ${props.hideCursor && css`
    cursor: none;
  `}
`);

interface PlayerControlsContainerProps {
  hideCursor?: boolean;
}

export const ControlsGridContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  opacity: 1;
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

export const PlayPauseIcon = styled.button<PlayPauseIconProps>((props) => css`
  grid-area: play;
  height: 15px;
  mix-blend-mode: difference;
  cursor: pointer;
  opacity: 0;
  transition: opacity 300ms;

  svg {
    position: relative;
    height: 100%;

    path {
      fill: #fff;
    }
  }

  ${props.visible && css`
    opacity: 1;
  `}
`);

interface PlayPauseIconProps {
  visible?: boolean;
}
