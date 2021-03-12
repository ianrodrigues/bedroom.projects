import { createGlobalStyle } from 'styled-components';

const globalStyle = createGlobalStyle`
  body {
    background-color: #000;
  }
  
  html {
    box-sizing: border-box;
    min-height: 100%;
    height: 100%;
  }

  main {
    position: relative;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  *,
  *::after,
  *::before {
    box-sizing: inherit;
  }

  body {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: sans-serif;
  }
`;

export default globalStyle;
