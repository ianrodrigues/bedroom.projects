import { createGlobalStyle } from 'styled-components';

const globalStyle = createGlobalStyle`
  body {
    overflow-x: hidden;
    background-color: #000;
  }
  
  html {
    box-sizing: border-box;
    min-height: 100%;
    height: 100%;
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

  body {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: sans-serif;
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
