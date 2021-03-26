import styled, { css } from 'styled-components';

const EASING = 'cubic-bezier(.19, 1, .22, 1)';

export const GridToggleContainer = styled.button<GridToggleContainerProps>((props) => css`
  position: relative;
  padding: 0;
  margin: 0;
  width: 24px;
  height: 24px;
  font-size: 16px;
  border: 0;
  background: none;
  cursor: pointer;
  transition: transform 500ms ${EASING};
  
  ${props.isGrid && css`
    transform: rotate(-90deg);
  `}

  span:nth-child(1) {
    top: 0;
    left: 0;

    ${props.isGrid && css`
      width: 24px;
    `}
  }
  span:nth-child(2) {
    left: 0;
    bottom: 0;

    ${props.isGrid && css`
      width: 24px;
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
  width: 10px;
  height: 10px;
  border: 1px solid #fff;
  transition:
    width 400ms ${EASING} 500ms,
    opacity 400ms ${EASING} 500ms,
    left 400ms ${EASING} 500ms,
    right 400ms ${EASING} 500ms,
    top 400ms ${EASING} 500ms,
    bottom 400ms ${EASING} 500ms;
`;
