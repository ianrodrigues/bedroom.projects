import styled, { css } from 'styled-components';
import { Link } from 'react-location';


export const HomeLinkAnchor = styled(Link)((props) => css`
  display: block;
  margin: 0 auto;
  font-size: 30px;
  color: #fff;
  text-decoration: none;
  mix-blend-mode: difference;
  font-family: ${props.theme.fonts.primary};
`);
