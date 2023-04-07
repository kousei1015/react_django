import styled from "styled-components";

export const NavWrapper = styled.div`
  margin-top: 0.75rem;
  border-radius: 1rem;
  padding: 1.25rem;
  object-fit: contain;
  display: flex;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  @media (max-width: 520px) {
    border-radius: 0;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0%;
    left: 0;
    width: 100%;
    height: fit-content;
    margin: 0;
    padding: 1rem 0;
    gap: 0.8rem;
    background-color: white;
    box-shadow: 0 -3px 6px #bab7b7;
  }
`;

export const NavButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: transparent;
  padding-top: 3px;
  font-size: 1.75rem;
  font-family: 'M PLUS Rounded 1c';
  border: none;
  outline: none;
  color: #4b4a4a;
  cursor: pointer;
  @media screen and (min-width: 350px) and (max-width: 520px) {
    font-size: 20px;
  }
`;