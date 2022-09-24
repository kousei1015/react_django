import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
  background-color: #B5FE83;
  color: #346751;
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  }

  * {
  box-sizing: border-box;
  }
  p {
  margin: 6px;
  }
  code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  }
`;
