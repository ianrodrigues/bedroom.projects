import styled from 'styled-components';

export const Canvas = styled.canvas<CanvasProps>`
  top: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 400ms;

  ${(props) => props.show && `
    opacity: 1;
  `}
`;

interface CanvasProps {
  show: boolean;
}
