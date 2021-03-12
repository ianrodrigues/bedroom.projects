import styled, { css } from 'styled-components';


export const Canvas = styled.canvas<CanvasProps>((props) => css`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0;
  transform: scale(.95);
  background-color: #000;
  pointer-events: none;
  transition: opacity 400ms, transform 400ms ease-out;

  ${props.show && `
    opacity: 1;
    transform: scale(1);
  `}
`);

interface CanvasProps {
  show: boolean;
}
