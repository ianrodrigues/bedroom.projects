import styled, { css } from 'styled-components';

export const Name = styled.h1<NameProps>((props) => `
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 50% 0 0;
  transform: translate(-50%, -50%);
  padding: 0;
  font-family: 'Caveat Brush', sans-serif;
  mix-blend-mode: difference;
  color: #fff;
  font-size: 150px;
  opacity: 1;
  transition: opacity 500ms;

  ${!props.show && css`
    opacity: 0;
  `}
`);

interface NameProps {
  show: boolean;
}
