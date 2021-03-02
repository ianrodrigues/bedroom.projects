import styled, { css } from 'styled-components';

export const PhotoFilmPreviewContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #000;
`;

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
