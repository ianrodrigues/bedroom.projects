import styled, { css } from 'styled-components';

import { MediaTitleContainer } from 'common/typography/MediaTitle/styled';


export const MediaTitleOverlayContainer = styled.div<MediaTitleOverlayContainerProps>((props) => css`
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

interface MediaTitleOverlayContainerProps {
  $visible?: boolean;
}
