import styled from 'styled-components';

export const PhotoDetailContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  pointer-events: none;
  padding: ${Math.floor(window.innerHeight * .5)}px 20px 0;
`;

export const Img = styled.img`
  padding: 0 0 ${Math.floor(window.innerHeight * .3)}px;
  opacity: 0;
  transform: translate3d(0, 150px, 0);
  transition: opacity 1s, transform 1s;

  &.visible {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;
