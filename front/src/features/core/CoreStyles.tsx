import styled from "styled-components";

export const Grid = styled.div`
  width: calc(100% - 32px);
  margin: 16px;
  display: flex;
  flex-wrap: wrap;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const GridChild = styled.div`
  width: calc((100% / 3) - 24px);
  margin: 12px;
  @media screen and (max-width: 768px) {
    width: 100%;
    margin: 0;
  }
`;

export const CoreTitle = styled.h1`
  font-weight: bold;
  text-align: center;
  font-size: 1.5rem;
  padding: 0.7rem;
  margin: 0;
  color: #4b4a4a
`;

export const CoreSelectMenu = styled.select`
  width: 100%;
  max-width: 600px;
  display: flex;
  margin: 0 auto;
  cursor: pointer;
  padding: 0.7rem;
  border-radius: 1.25rem;
`;

export const CoreContainer = styled.div`
  padding: 1.25rem;
  margin-bottom: 4.35rem;
`;

export const PaginateNav = styled.nav`
  display: flex;
  justify-content: center;
`;

export const PaginateButton = styled.button<{active: boolean}>`
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: 50%;
  padding: 1rem;
  margin: 0 5px;
  background-color: ${(props) => props.active ? "red": "coral"};
  scale: ${(props) => props.active ? 1.1: 1.0};
  color: white;
`;
