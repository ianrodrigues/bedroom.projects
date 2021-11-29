import styled, { css } from 'styled-components';
import { Link } from 'react-location';


interface FooterProps {
  $visible?: boolean;
}

export const LinkCSS = css<FooterProps>((props) => css`
  position: fixed;
  bottom: 15px;
  z-index: 2;
  font-family: ${props.theme.fonts.secondary};
  font-size: 24px;
  color: #fff;
  text-decoration: none;
  mix-blend-mode: difference;
  opacity: 0;
  transition: opacity 300ms;
  pointer-events: none;

  ${props.$visible && css`
    opacity: 1;
    pointer-events: auto;
  `}
`);

export const InfoLink = styled(Link)<FooterProps>`
  ${LinkCSS};
  left: 20px;
`;

export const SocialMediaLink = styled.a.attrs({
  target: '_blank',
  rel: 'noreferrer',
})`
  ${LinkCSS};
  right: 20px;

  &:last-of-type {
    right: 50px;
  }

  svg {
    height: 24px;
  
    path {
      fill: #fff;
    }
  }
`;
