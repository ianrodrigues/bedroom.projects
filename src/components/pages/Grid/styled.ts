import styled, { css } from 'styled-components';


export const GridPageContainer = styled.div`
  position: absolute;
  top: 105px;
  left: 20px;
  right: 20px;
  margin: auto;
  padding: 0;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: auto;
  column-gap: 30px;
  row-gap: 50px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  max-width: 1600px;
`;

export const GridTile = styled.div`
  transition: opacity 200ms;

  a {
    display: block;
    width: 100%;
    height: 100%;
    color: #fff;
    text-decoration: none;
    font-family: 'Caveat Brush', sans-serif;
  }

  &:hover {
    opacity: .75;
  }
`;

export const Figure = styled.figure<FigureProps>((props) => css`
  margin: 0;
  padding: 0;
  width: 100%;
  margin-bottom: 15px;
  background-image: url("${props.src}");
  background-size: cover;
  background-position: 50%;

  &::before {
    content: '';
    display: block;
    padding-top: 66%;
  }
`);

interface FigureProps {
  src: string;
}

export const Title = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 25px;
  line-height: 1;
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-bottom: 30px;

  button {
    margin: 0;
    padding: 0;
    color: #aaa;
    background: none;
    border: 0;
    font-size: 20px;
    cursor: pointer;
    transition: color 200ms;

    &:first-child {
      margin-right: 10px;
    }

    &:hover {
      color: #fff;
    }
  }
`;
