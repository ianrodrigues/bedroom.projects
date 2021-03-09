import * as i from 'types';
import styled, { css } from 'styled-components';

import { MediaTitleContainer } from 'common/typography/MediaTitle/styled';
import { ImgContainer } from './components/RowImg/styled';


export const Row = styled.div<RowProps>((props) => css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  position: relative;
  margin: 0;
  width: 100%;
  box-sizing: border-box;

  ${props.location === 'right' && css`
    justify-content: flex-end;
  `}

  ${props.location === 'middle' && css`
    justify-content: center;
  `}

  ${props.displayType === 'fill' && css`
    justify-content: space-around;
  `}
`);

interface RowProps {
  $height?: number;
  location?: i.Layout['row_location'];
  displayType?: i.Layout['display_type'];
}

export const NextContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;

  ${MediaTitleContainer} {
    top: 105px;
    left: 0;
    bottom: auto;
  }

  ${ImgContainer} {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export const FullContentContainer = styled.div`
  padding-bottom: 300px;
`;
