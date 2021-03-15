import styled, { css, keyframes } from 'styled-components';


export const LoaderContainer = styled.div<LoaderContainerProps>((props) => css`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  background-color: #000;
  pointer-events: none;
  transition: opacity 500ms;

  ${props.visible  && css`
    opacity: 1;
  `}
`);

interface LoaderContainerProps {
  visible?: boolean;
}

const Frames = keyframes`
  0% {
    transform: scaleX(0);
  }
  5% {
    transform: scaleX(.5);
  }
  50% {
    transform: scaleX(.75);
  }
  100% {
    transform: scaleX(.99);
  }
`;

export const LoaderInner = styled.div<LoaderInnerProps>((props) => css`
  height: 5px;
  width: 100%;
  transform: scaleX(1);
  transform-origin: left;
  background-color: #fff;
  transition: transform 100ms;
  animation-name: ${Frames};
  animation-duration: 30s;

  ${props.done && css`
    transform: scaleX(1) !important;
  `}
`);

interface LoaderInnerProps {
  done?: boolean;
}
