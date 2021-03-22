import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';


export const SocialMediaLinksContainer = styled.div<FooterProps>((props) => css`
  position: fixed;
  bottom: 15px;
  right: 0;
  padding: 0 20px;
  opacity: 0;
  transition: opacity 300ms;
  pointer-events: none;

  a {
    position: relative;
    z-index: 2;
    mix-blend-mode: difference;
    color: #fff;

    svg {
      height: 24px;
    
      path {
        fill: #fff;
      }
    }

    &:not(:last-child) {
      padding-right: 10px;
    }
  }

  ${props.$visible && css`
    opacity: 1;
    pointer-events: auto;
  `}
`);

export const InfoLink = styled(Link)<FooterProps>((props) => css`
  position: fixed;
  bottom: 15px;
  z-index: 2;
  padding: 0 20px;
  font-family: 'Roboto';
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

interface FooterProps {
  $visible?: boolean;
}
