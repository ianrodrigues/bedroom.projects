import styled, { css } from 'styled-components';


export const HeaderContainer = styled.header<HeaderContainerProps>((props) => css`
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  margin: auto;
  width: 100vw;
  cursor: default;
  user-select: none;

  ${props.isOpen && css`
    nav div {
      height: auto;
    }
  `}
`);

interface HeaderContainerProps {
  isOpen?: boolean;
}

export const Nav = styled.nav((props) => css`
  position: fixed;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 20px;
  width: 100vw;
  height: 50px;
  overflow: visible;
  mix-blend-mode: difference;
  font-family: ${props.theme.fonts.secondary};

  div {
    height: 0;
  }
`);

function setListAnimations(props: NavContainerProps) {
  const MAX_LIST_NUM = 10;
  const DELAY = 30;
  let str = '';

  for (let i = 0; i < MAX_LIST_NUM; i++) {
    const delay = props.isOpen
      ? DELAY * i
      : DELAY * MAX_LIST_NUM - (i * DELAY);

    str += `
      li:nth-child(${i + 1}) {
        transition-delay: ${delay}ms;
      }
    `;
  }

  return str;
}

export const NavContainer = styled.div<NavContainerProps>((props) => css`
  opacity: 0;
  transition: opacity 300ms;

  ${setListAnimations(props)};

  &:last-of-type {
    text-align: right;
  }

  ${props.visible && css`
    opacity: 1;
  `}

  ${props.isOpen && css`
    li {
      pointer-events: auto;
      transform: translate3d(0, 0, 0);
      opacity: .5;
    }
  `}
`);

interface NavContainerProps {
  isOpen?: boolean;
  visible?: boolean;
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
  display: inline-block;
  margin: 0;
  padding: 0;
  color: #fff;
`;

export const HomeGridLinkContainer = styled.div`
  display: flex;
  justify-content: center;
`;
