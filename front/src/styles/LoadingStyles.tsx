import styled, { keyframes } from "styled-components";

export const animation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 10px }
  100% { margin-bottom: 0 }
`;

export const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DotWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const Dot = styled.span<{delay: string}>`
  background-color: #4b4a4a;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  margin: 0 7px;
  animation: ${animation} 1.2s linear infinite;
  animation-delay: ${props => props.delay};
`;

export const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
`;
