import styled, { css } from 'styled-components';


export const PlayerControlsContainer = styled.div<PlayerControlsContainerProps>((props) => css`
  width: ${props.$width || 0}px;
  height: ${props.$height || 0}px;
`);

interface PlayerControlsContainerProps {
  $width?: number;
  $height?: number;
}
