import { MediaTitleContainer } from 'common/typography/MediaTitle/styled';
import styled, { css } from 'styled-components';


export const Row = styled.div<RowProps>((props) => css`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 0;
  width: 100%;
  min-height: ${props.$height ? `${props.$height}px` : 'auto'};
`);

interface RowProps {
  $height?: number;
}

export const Img = styled.img<ImgProps>((props) => css`
  padding: ${Math.floor(window.innerHeight * .3)}px 20px 0;
  max-width: 100%;
  opacity: 0;
  transform: translate3d(${props.offsetX || 0}px, ${(props.offsetY || 0) + 150}px, 0);
  transition: opacity 1s cubic-bezier(0.25, 1, 0.5, 1), transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
  scale: ${props.$scale || 1};

  &.visible {
    opacity: 1;
    transform: translate3d(${props.offsetX || 0}px, ${props.offsetY || 0}px, 0);
  }

  ${props.position === 'right' && css`
    display: block;
    margin-left: auto;
  `}

  ${props.position === 'middle' && css`
    display: block;
    margin: 0 auto;
  `}

  ${props.offsetX && css`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  `}

  ${props.isNextHeader && css`
    opacity: 1;
    transform: translate3d(0, 200px, 0);
  `}
`);

type Px = number;

interface ImgProps {
  position?: 'left' | 'middle' | 'right';
  offsetX?: Px;
  offsetY?: Px;
  $scale?: number;
  isNextHeader?: boolean;
}

export const NextContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;

  ${MediaTitleContainer} {
    top: 105px;
    left: 0;
    bottom: auto;
  }

  ${Img} {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export const FullContentContainer = styled.div`
  padding-bottom: 300px;
`;
