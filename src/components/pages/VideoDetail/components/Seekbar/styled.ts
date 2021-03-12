import styled from 'styled-components';


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