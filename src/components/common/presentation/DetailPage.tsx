import styled, { css } from 'styled-components';


export const DetailContainer = styled.div((props) => css`
  top: 0;
  left: 0;
  padding: 0 20px;
  width: 100%;
  color: #fff;
  font-family: ${props.theme.fonts.secondary};
`);
