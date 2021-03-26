import * as i from 'types';
import styled, { css } from 'styled-components';


const EASING = 'cubic-bezier(0.25, 1, 0.5, 1)';

export const ImgContainer = styled.div.attrs({
  'data-img-container': true,
})<ImgContainerProps>((props) => css`
  flex: 0 0 auto;
  flex-basis: 50%;
  padding: calc(100vh * .3) 0 0;
  max-width: 50%;
  opacity: 0;
  transform:
    translate3d(${props.offsetX || 0}px, ${(props.offsetY || 0) + 150}px, 0)
    scale(${props.$scale || 1});
  transition: opacity 1s ${EASING}, transform 1.2s ${EASING};

  &:first-child {
    padding-right: 10px;
  }
  &:not(:first-child) {
    padding-left: 10px;
  }

  ${props.displayType === 'together' && css`
    flex-basis: calc(100% / 3);
    max-width: calc(100% / 3);
  `}

  ${props.displayType === 'fill' && css`
    flex-basis: 100%;
    max-width: 100%;
  `}

  ${props.isNextHeader && css`
    opacity: 1;
    transform: translate3d(0, 200px, 0);
  `}

  &.visible {
    opacity: 1;
    transform:
      translate3d(${props.offsetX || 0}px, ${props.offsetY || 0}px, 0)
      scale(${props.$scale || 1});
  }
`);

type Px = number;
interface ImgContainerProps {
  displayType?: i.Layout['display_type'];
  offsetX?: Px;
  offsetY?: Px;
  $scale?: number;
  isNextHeader?: boolean;
}

export const ImgFigure = styled.figure`
  display: block;
  position: relative;
  margin: 0;
  padding: 0;
  border: 0;
  width: 100%;
`;

export const Img = styled.img`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100%;
  height: auto;
`;
