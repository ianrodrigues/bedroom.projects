import styled, { css } from 'styled-components';

export const HeaderContainer = styled.header`
  position: fixed;
  top: 15px;
  left: 0;
  right: 0;
  z-index: 2;
  margin: auto;
  width: 100vw;
  height: 100vh;

  canvas {
    position: absolute;
    top: -15px;
  }
`;

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  mix-blend-mode: difference;
  font-family: 'Roboto', sans-serif;
`;

function setListAnimations(props: NavContainerProps) {
  const MAX = 10;
  const DELAY = 30;
  let str = '';

  for (let i = 0; i < MAX; i++) {
    const delay = props.isOpen
      ? DELAY * i
      : DELAY * MAX - (i * DELAY);

    str += `
      li:nth-child(${i + 1}) {
        transition-delay: ${delay}ms;
      }
    `;
  }

  return str;
}

export const NavContainer = styled.div<NavContainerProps>`
  ${(props) => setListAnimations(props)};

  &:last-of-type {
    text-align: right;
  }

  ${(props) => props.isOpen && css`
    li {
      pointer-events: auto;
      transform: translate3d(0, 0, 0);
      opacity: .5;
    }
  `}
`;

interface NavContainerProps {
  isOpen: boolean;
}

export const List = styled.ul`
  margin: 0;
  padding: 3px 0;
  list-style: none;
  pointer-events: none;
`;

export const ListItem = styled.li`
  padding: 3px 0;
  opacity: 0;
  transform: translate3d(0, -5px, 0);
  transition: opacity 100ms, transform 100ms;
  cursor: default;

  a {
    display: block;
    color: #fff;
    font-size: 20px;
    text-decoration: none;
  }

  &:hover {
    opacity: 1 !important;
  }
`;

export const H2 = styled.h2`
  margin: 0;
  padding: 0;
  color: #fff;
`;
