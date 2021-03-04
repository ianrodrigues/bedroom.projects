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
