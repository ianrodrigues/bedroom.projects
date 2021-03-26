import styled, { css } from 'styled-components';


export const FullscreenButton = styled.button<FullscreenButtonProps>((props) => css`
  height: 20px;
  mix-blend-mode: difference;
  cursor: pointer;
  opacity: 0;
  transition: opacity 300ms;

  ${props.$visible && css`
    opacity: 1;
  `}

  svg {
    height: 100%;

    path {
      fill: #fff;
    }
  }
`);

interface FullscreenButtonProps {
  $visible?: boolean;
}
