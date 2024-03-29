import styled, { css } from 'styled-components';


export const InfoContainer = styled.div<InfoContainerProps>((props) => css`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  opacity: 0;
  transform: translate3d(0, 25px, 0);
  transition: opacity 500ms, transform 500ms;

  ${props.$visible && css`
    opacity: 1;
    transform: translate3d(0, 0, 0);
  `}
`);

interface InfoContainerProps {
  $visible?: boolean;
}

export const InfoDescription = styled.div((props) => css`
  width: 40%;
  padding: 105px 20px 0;
  color: #fff;
  font-family: ${props.theme.fonts.secondary};
  font-size: 18px;
  white-space: pre-wrap;

  p {
    margin-top: 0;
    line-height: 1.333em;
  }

  a {
    color: #fff;
  }
`);

export const InfoFigure = styled.figure`
  position: fixed;
  bottom: 0;
  left: 40%;

  img {
    max-width: 100%;
    max-height: calc(100vh - 3.75em);
    width: auto;
    height: auto;
  }
`;
