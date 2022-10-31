import styled from "styled-components";

export const CustomButton = styled.button`
  background-color: transparent;
  color: #C0C0C0;
  padding-top: 3px;
  font-size: 28px;
  border: none;
  outline: none;
  cursor: pointer;
  @media screen and (min-width: 350px) and (max-width: 520px) {
    font-size: 14px;
  }
  @media screen and (max-width: 350px) {
    font-size: 12px;
  }
`;