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

  ${ImgContainer} {
    opacity: 1;
  }

  ${MediaTitleContainer} {
    left: 0;
    right: 0;
    top: auto;
    bottom: ${window.innerHeight - 200}px;
  }

  > div {
    position: relative;
    max-height: 100%;
  }
`;

export const FullContentContainer = styled.div`
  padding-bottom: 200px;
`;
