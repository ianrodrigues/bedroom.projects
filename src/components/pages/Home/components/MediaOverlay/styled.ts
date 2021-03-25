import styled, { css } from 'styled-components';


export const MediaOverlayContainer = styled.div<MediaOverlayContainerProps>((props) => css`
  display: none;
  position: absolute;
  width: 100vw;
  height: 100vh;
  pointer-events: none;

  ${props.$visible && css`
    display: block;
  `}
`);

interface MediaOverlayContainerProps {
  $visible?: boolean;
}
