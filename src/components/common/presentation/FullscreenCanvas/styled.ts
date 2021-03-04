import styled from 'styled-components';

export const Canvas = styled.canvas<CanvasProps>`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transform: scale(.97);
  background-color: #000;
  pointer-events: none;
  transition: opacity 400ms, transform 400ms;

  ${(props) => props.show && `
    opacity: 1;
    transform: scale(1);
  `}
`;

interface CanvasProps {
  show: boolean;
}
