import styled from 'styled-components';

export const HeaderContainer = styled.header`
  position: absolute;
  top: 30px;
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
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const List = styled.ul`
  padding: 0;
  list-style: none;

  &:last-of-type {
    li {
      text-align: right;
    }
  }
`;

export const ListItem = styled.li`
  color: #fff;
`;
