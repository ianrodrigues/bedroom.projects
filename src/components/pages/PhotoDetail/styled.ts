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
  opacity: 0;
  transform: translate3d(${props.offsetX || 0}px, ${(props.offsetY || 0) + 150}px, 0);
  transition: opacity 1s, transform 1.2s;
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
`);

type Px = number;

interface ImgProps {
  position?: 'left' | 'middle' | 'right';
  offsetX?: Px;
  offsetY?: Px;
  $scale?: number;
}
