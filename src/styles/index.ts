import { createGlobalStyle } from 'styled-components';

const globalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    overflow-x: hidden;
    background-color: #000;
  }
  
  html {
    box-sizing: border-box;
    min-height: 100%;
    height: 100%;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  main {
    position: relative;
    width: 100vw;
  }

  *,
  *::after,
  *::before {
    box-sizing: inherit;
  }

  button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    outline: none;
  }
`;

export default globalStyle;
