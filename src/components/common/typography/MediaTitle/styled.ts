import * as i from 'types';
import styled, { css } from 'styled-components';


export const MediaTitleContainer = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 105px;
  margin: auto;
  padding: 0;
  pointer-events: none;
`;

export const MediaTitleInner = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  max-width: 1600px;
`;

export const Title = styled.h3<TitleProps>((props) => css`
  position: absolute;
  z-index: 1;
  bottom: 0;
  margin: 0;
  width: 50%;
  max-width: 800px;
  font-size: 100px;
  line-height: .9;
  font-family: 'Caveat Brush', sans-serif;
  color: #fff;
  opacity: 0;
  mix-blend-mode: difference;

  ${props.side === 'R' && css`
    right: 0;
    text-align: right;
  `}

  ${props.show && css`
    opacity: 1;
  `}
`);

interface TitleProps {
  side: i.Side;
  show: boolean;
}
