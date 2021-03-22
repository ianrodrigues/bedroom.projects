import * as i from 'types';
import styled, { css } from 'styled-components';

import { MediaTitleContainer } from 'common/typography/MediaTitle/styled';
import { ImgContainer } from './components/RowImg/styled';


export const PhotoDetailContainer = styled.div`
  ${MediaTitleContainer} h3 {
    transition: opacity 300ms;
  }
`;

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

  ${props.displayType === 'spaced' && css`
    justify-content: space-between;
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
    position: absolute;
    left: 0;
    right: 0;

    h3 {
      position: absolute;
      top: calc(-100vh + 5px);
      bottom: auto;
    }
  }

  div:first-of-type {
    position: relative;
    height: 100vh;
  }
`;

export const FullContentContainer = styled.div`
  padding-bottom: 200px;
`;
