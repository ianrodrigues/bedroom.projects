import styled, { css } from 'styled-components';


export const Name = styled.h1<NameProps>((props) => css`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 4;
  margin: 0 50% 0 0;
  transform: translate(-50%, -50%);
  padding: 0;
  font-family: ${props.theme.fonts.primary};
  mix-blend-mode: difference;
  color: #fff;
  font-size: 150px;
  opacity: 0;
  transition: opacity 500ms;
  user-select: none;
  pointer-events: none;

  ${props.$visible && css`
    opacity: 1;
  `}
`);

interface NameProps {
  $visible: boolean;
}
