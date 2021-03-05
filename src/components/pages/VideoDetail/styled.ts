import styled from 'styled-components';


export const DescriptionContainer = styled.div`
  display: grid;
  grid-template-columns: 40% 1fr;
  grid-template-rows: 1fr;
  gap: 0px 50px;
  grid-template-areas: "description credits";
  padding-top: 100px;

  div {
    color: #fff;
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
  }
`;
