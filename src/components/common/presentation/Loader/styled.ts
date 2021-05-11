import * as i from 'types';
import styled, { css, keyframes } from 'styled-components';


export const LoaderContainer = styled.div<LoaderContainerProps>((props) => css`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  pointer-events: none;
  transition: opacity 500ms;
  
  ${props.$type === 'site' && css`
    background-color: #000;
  `}

  ${props.$visible && css`
    transition: opacity 0s;
    opacity: 1;
  `}
`);

interface LoaderContainerProps {
  $visible?: boolean;
  $type: i.GlobalLoadingState;
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
  75% {
    transform: scaleX(.9);
  }
  100% {
    transform: scaleX(.999999);
  }
`;

export const LoaderInner = styled.div<LoaderInnerProps>((props) => css`
  height: 5px;
  width: 100%;
  transform: scaleX(0);
  transform-origin: left;
  background-color: #fff;
  transition: transform 100ms;

  ${!props.done && css`
    animation-name: ${Frames};
    animation-duration: 60s;
    animation-fill-mode: forwards;
  `}

  ${props.done && css`
    transition: transform 300ms;
    transform: scaleX(1);
  `}
`);

interface LoaderInnerProps {
  done?: boolean;
}
