import styled, { keyframes } from "styled-components";

export const animation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 10px }
  100% { margin-bottom: 0 }
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

export const CoreTitle = styled.h1`
  font-weight: bold;
  text-align: center;
  font-size: 34px;
  padding: 10px;
  margin: 0;
  color: #4b4a4a
`;

export const CoreSelectMenu = styled.select`
  width: 100%;
  max-width: 600px;
  display: flex;
  margin: 0 auto;
  cursor: pointer;
  padding: 10px;
  border-radius: 20px;
`;

export const CoreContainer = styled.div`
  padding: 20px;
  margin-bottom: 70px;
`;

export const PaginateNav = styled.nav`
  display: flex;
  justify-content: center;
`;

export const PaginateButton = styled.button<{active: boolean}>`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  padding: 1rem;
  margin: 0 5px;
  background-color: ${(props) => props.active ? "red": "coral"};
  scale: ${(props) => props.active ? 1.1: 1.0};
  color: white;
`;
