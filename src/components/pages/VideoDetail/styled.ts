import styled, { css } from 'styled-components';

import { PlayerContainer } from './components/Player/styled';


export const DescriptionContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 20%;
  grid-template-rows: 1fr;
  gap: 0px 20px;
  grid-template-areas: "description credits";
  padding-top: 100px;

  div {
    color: #fff;
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    white-space: pre-wrap;
  }
`;

export const DetailPlayerOverlay = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: #000;
  transform-origin: top;
`;

export const VideoPoster = styled.div<VideoPosterProps>((props) => css`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: url(${props.src}) no-repeat center center fixed; 
  background-size: cover;
  transform: translate3d(0, 150px, 0);
  pointer-events: none;
`);

interface VideoPosterProps {
  src: string;
}

const ease = 'cubic-bezier(0, 0.55, 0.45, 1)';

export const DetailPlayerContainer = styled.div<DetailPlayerContainerProps>((props) => css`
  position: relative;
  width: 100%;
  height: ${window.innerHeight - 50}px;

  ${PlayerContainer} {
    opacity: 0;
  }

  ${props.isReady && css`
    transform: translate3d(0, 0, 0);

    ${DetailPlayerOverlay} {
      transition: transform 1s ${ease};
      transform: scaleY(0);
    }

    ${VideoPoster} {
      transition: opacity 500ms 1.5s ${ease}, transform 1.2s ${ease};
      opacity: 0;
      transform: translate3d(0, 0, 0);
    }

    ${PlayerContainer} {
      transition: opacity 1s 2.5s ${ease};
      opacity: 1;
    }
  `}
`);

interface DetailPlayerContainerProps {
  isReady: boolean;
}
