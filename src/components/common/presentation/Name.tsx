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
  opacity: 1;
  transition: opacity 500ms;
  user-select: none;
  pointer-events: none;

  ${!props.show && css`
    opacity: 0;
  `}
`);

interface NameProps {
  show: boolean;
}
