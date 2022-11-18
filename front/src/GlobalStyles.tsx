import { createGlobalStyle } from "styled-components";


export const GlobalStyles = createGlobalStyle`
  body {
  background-color: #00FFF0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%231a9736' points='957 450 539 900 1396 900'/%3E%3Cpolygon fill='%23105f22' points='957 450 872.9 900 1396 900'/%3E%3Cpolygon fill='%231a9736' points='-60 900 398 662 816 900'/%3E%3Cpolygon fill='%23105f22' points='337 900 398 662 816 900'/%3E%3Cpolygon fill='%231a9736' points='1203 546 1552 900 876 900'/%3E%3Cpolygon fill='%23105f22' points='1203 546 1552 900 1162 900'/%3E%3Cpolygon fill='%231a9736' points='641 695 886 900 367 900'/%3E%3Cpolygon fill='%23105f22' points='587 900 641 695 886 900'/%3E%3Cpolygon fill='%231a9736' points='1710 900 1401 632 1096 900'/%3E%3Cpolygon fill='%23105f22' points='1710 900 1401 632 1365 900'/%3E%3Cpolygon fill='%231a9736' points='1210 900 971 687 725 900'/%3E%3Cpolygon fill='%23105f22' points='943 900 1210 900 971 687'/%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom;
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
  ::-webkit-scrollbar{
    display: none;
  }
  p {
  margin: 6px;
  }
  code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  }
`;
