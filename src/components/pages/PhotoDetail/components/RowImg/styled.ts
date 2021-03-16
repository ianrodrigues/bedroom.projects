import * as i from 'types';
import styled, { css } from 'styled-components';


export const ImgContainer = styled.div.attrs({
  'data-img-container': true,
})<ImgContainerProps>((props) => css`
  box-sizing: border-box;
  flex: 0 0 auto;
  padding: ${Math.floor(window.innerHeight * .3)}px 0 0;
  flex-basis: 50%;
  max-width: 50%;
  opacity: 0;
  transform: translate3d(${props.offsetX || 0}px, ${(props.offsetY || 0) + 150}px, 0);
  transition: opacity 1s cubic-bezier(0.25, 1, 0.5, 1), transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
  scale: ${props.$scale || 1};

  &:first-child {
    padding-right: 10px;
  }
  &:not(:first-child) {
    padding-left: 10px;
  }

  ${props.displayType === 'together' && css`
    flex-basis: ${100 / 3}%;
    max-width: ${100 / 3}%;
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
    transform: translate3d(${props.offsetX || 0}px, ${props.offsetY || 0}px, 0);
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
