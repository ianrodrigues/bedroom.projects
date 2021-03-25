import styled, { css } from 'styled-components';

import { MediaTitleContainer } from 'common/typography/MediaTitle/styled';


export const MediaOverlayContainer = styled.div<MediaOverlayContainerProps>((props) => css`
  display: none;
  position: absolute;
  width: 100vw;
  height: 100vh;
  pointer-events: none;

  ${props.$visible && css`
    display: block;
  `}

  ${MediaTitleContainer} h3 {
    transition: opacity 300ms;
  }
`);

interface MediaOverlayContainerProps {
  $visible?: boolean;
}
