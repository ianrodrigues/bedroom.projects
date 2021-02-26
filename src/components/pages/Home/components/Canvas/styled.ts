import styled, { css } from 'styled-components';


export const TitleContainer = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 30px;
  margin: auto;
  padding: 0;
  pointer-events: none;
`;

export const TitleInner = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  max-width: 1600px;
`;

export const MediaTitle = styled.h3<MediaTitleProps>((props) => `
  position: absolute;
  bottom: 0;
  margin: 0;
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
