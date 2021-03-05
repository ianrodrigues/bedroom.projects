import styled, { css } from 'styled-components';


export const PlayerControlsContainer = styled.div<PlayerControlsContainerProps>((props) => css`
  position: relative;
  width: ${props.$width || 0}px;
  height: ${props.$height || 0}px;
`);

interface PlayerControlsContainerProps {
  $width?: number;
  $height?: number;
}

export const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr 70px 70px;
  grid-template-rows: 1fr 60px;
  gap: 0px 10px;
  grid-template-areas:
    "display display display display"
    "play seekbar volume fullscreen";
  justify-items: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const VideoArea = styled.div`
  grid-column-start: display-start;
  grid-column-end: display-end;
  grid-row: 1;
  width: 100%;
  height: 100%;
`;

export const PlayPauseIcon = styled.div`
  grid-area: play;
  height: 20px;

  svg {
    position: relative;
    height: 100%;

    path {
      fill: #fff;
    }
  }
`;
