import styled, { css } from 'styled-components';


export const PhotoDetailContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  pointer-events: none;
`;

export const Row = styled.div`
  position: relative;
  margin: 0;
  width: 100%;
`;

export const Img = styled.img<ImgProps>((props) => css`
  padding: ${Math.floor(window.innerHeight * .3)}px 20px 0;
  opacity: 0;
  transform: translate3d(${props.offsetX || 0}px, ${(props.offsetY || 0) + 150}px, 0);
  transition: opacity 1s, transform 1s;
  scale: ${props.scale || 1};

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
`);

type Px = number;

interface ImgProps {
  position?: 'left' | 'middle' | 'right';
  offsetX?: Px;
  offsetY?: Px;
  scale?: number;
}
