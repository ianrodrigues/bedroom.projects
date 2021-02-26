import styled, { css } from 'styled-components';


export const TitleContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  margin: auto;
  padding: 0;
`;

export const TitleInner = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  max-width: 1600px;
`;

export const MediaTitle = styled.h3<MediaTitleProps>((props) => `
  position: absolute;
  bottom: 0;
  width: 50%;
  max-width: 800px;
  font-size: 100px;
  line-height: .9;
  font-family: 'Caveat Brush', sans-serif;
  color: #fff;
  opacity: 0;
  transition: opacity 300ms;
  mix-blend-mode: difference;

  &:last-of-type {
    right: 0;
    text-align: right;
  }

  ${props.show && css`
    opacity: 1;
  `}
`);

interface MediaTitleProps {
  show: boolean;
}
