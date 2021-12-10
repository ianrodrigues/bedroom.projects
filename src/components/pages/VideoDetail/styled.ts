import * as i from 'types';
import styled, { css } from 'styled-components';

import { MediaTitleContainer } from 'common/typography/MediaTitle/styled';
import { DetailContainer } from 'common/presentation/DetailPage';

import { PlayerContainer } from './components/Player/styled';


const EASING = 'cubic-bezier(0, 0.55, 0.45, 1)';


export const VideoDetailContainer = styled.div<VideoDetailContainerProps>((props) => css`
  ${(props.isNext !== 'ending') && css`
    ${MediaTitleContainer} h3 {
      transition: opacity 300ms;
    }
  `}

  ${DetailContainer} {
    padding: 0;
  }
`);

interface VideoDetailContainerProps {
  isNext?: i.GoingNextPhases;
}

export const DescriptionContainer = styled.div((props) => css`
  display: grid;
  grid-template-columns: 20% 20%;
  grid-template-rows: 1fr;
  gap: 0px 20px;
  grid-template-areas: "description credits";
  padding: 100px 20px 200px;
  min-height: 100vh;

  div {
    color: #fff;
    font-family: ${props.theme.fonts.secondary};
    font-size: 18px;
    line-height: 1.333em;
    white-space: pre-wrap;

    p {
      margin-top: 0;
    }

    a {
      color: #fff;
    }
  }
`);

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
  background: url(${props.$src}) no-repeat center center; 
  background-size: cover;
  transform: translate3d(0, 150px, 0);
  pointer-events: none;
`);

interface VideoPosterProps {
  $src: string;
}

export const DetailPlayerContainer = styled.div<DetailPlayerContainerProps>((props) => css`
  position: relative;
  width: 100%;
  height: calc(100vh - 50px);

  ${PlayerContainer} {
    opacity: 0;
  }

  ${props.isReady && css<DetailPlayerContainerProps>`
    transform: translate3d(0, 0, 0);

    ${DetailPlayerOverlay} {
      ${!props.isNext && css`
        transition: transform 600ms ${EASING};
      `}

      transform: scaleY(0);
    }

    ${VideoPoster} {
      ${!props.isNext && css`
        transition: transform 600ms ${EASING}, opacity 500ms 1s ${EASING};
      `}

      opacity: 0;
      transform: translate3d(0, 0, 0);
    }

    ${PlayerContainer} {
      transition: opacity 1s 1.5s ${EASING};
      opacity: 1;
    }
  `}
`);

interface DetailPlayerContainerProps {
  isReady?: boolean;
  isNext?: boolean;
}

export const NextContainer = styled.div<NextContainerProps>((props) => css`
  position: relative;
  width: 100%;
  height: 100vh;

  ${DetailPlayerContainer} {
    padding: calc(100vh * .3) 0 0;
  }
  
  ${VideoPoster} {
    transform: translate3d(0, 0, 0);

    ${!!props.isGoingNext && css`
      transition: opacity 600ms 1.5s ${EASING};
      opacity: 0;
    `}
  }

  ${DetailPlayerOverlay} {
    transform: scaleY(.5);

    ${!!props.isGoingNext && css`
      transition: transform 600ms 300ms ease-in-out;
      transform: scaleY(0);
    `}
  }

  ${MediaTitleContainer} {
    position: absolute;
    right: 0;
    left: 0;

    > div {
      height: 100vh;
    }

    h3 {
      position: absolute;
      bottom: calc(200vh - 95px);
    }
  }
`);

interface NextContainerProps {
  isGoingNext?: i.GoingNextPhases;
}
