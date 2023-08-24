import styled from "styled-components"

export const Button = styled.button<{ isSmall?: boolean }>`
  background-color: #303f9f;
  color: #fff;
  font-size: 0.85rem;
  padding: ${(props) => (props.isSmall ? "0.4rem" : "0.6rem 1rem")};
  letter-spacing: 1.5px;
  border-radius: 8px;
  &:hover {
    background-color: #14206f;
  }
`;