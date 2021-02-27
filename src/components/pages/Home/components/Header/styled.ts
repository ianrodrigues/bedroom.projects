import styled from 'styled-components';

export const HeaderContainer = styled.header`
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  margin: auto;
  width: 100vw;
  height: 100vh;
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

function getAnimations() {
  let str = '';

  for (let i = 1; i < 10; i++) {
    str += `
      li:nth-child(${i}) {
        opacity: 0.5;
        transform: translate3d(0, 0, 0);
        transition-delay: ${30 * i}ms;
      }
    `;
  }

  return str;
}

export const NavContainer = styled.div`
  &:hover {
    ${getAnimations()}
  }

  &:last-of-type {
    text-align: right;
  }
`;

export const List = styled.ul`
  margin: 0;
  padding: 3px 0;
  list-style: none;
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
