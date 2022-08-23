import styled from "styled-components";

export const Header = styled.div`
  margin-top: 12px;
  position: sticky;
  border-radius: 18px;
  top: 0;
  background-color: white;
  padding: 20px;
  border-bottom: 1px solid lightgray;
  object-fit: contain;
  display: flex;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderText = styled.h1`
  font-weight: normal;
  text-align: center;
  font-size: 34px;
  padding: 10px;
  margin: 0;
  @media screen and (max-width: 520px) {
    font-size: 14px;
  }
`;

export const Logout = styled.div`
  display: flex;
  justify-content: flex-end;
`;
