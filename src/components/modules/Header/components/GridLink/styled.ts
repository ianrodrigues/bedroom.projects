import styled, { css } from 'styled-components';


export const GridToggleContainer = styled.button<GridToggleContainerProps>((props) => css`
  position: relative;
  padding: 0;
  margin: 0;
  width: 1.5em;
  height: 1.5em;
  font-size: 1em;
  border: 0;
  background: none;
  cursor: pointer;
  transition: transform .5s cubic-bezier(.19, 1, .22, 1);
  
  ${props.isGrid && css`
    transform: rotate(-90deg);
  `}

  span:nth-child(1) {
    top: 0;
    left: 0;

    ${props.isGrid && css`
      width: 1.5em;
    `}
  }
  span:nth-child(2) {
    left: 0;
    bottom: 0;

    ${props.isGrid && css`
      width: 1.5em;
    `}
  }
  span:nth-child(3) {
    top: 0;
    right: 0;

    ${props.isGrid && css`
      width: 0;
      opacity: 0;
    `}
  }
  span:nth-child(4) {
    bottom: 0;
    right: 0;

    ${props.isGrid && css`
      width: 0;
      opacity: 0;
    `}
  }
`);

interface GridToggleContainerProps {
  isGrid?: boolean;
}

export const GridPart = styled.span`
  position: absolute;
  margin: 0;
  padding: 0;
  width: .6em;
  height: .6em;
  border: 1px solid #fff;
  box-sizing: border-box;
  transition: .4s cubic-bezier(.19, 1, .22, 1) .5s;
`;
