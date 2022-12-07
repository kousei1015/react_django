import styled from "styled-components";

export const CoreHeader = styled.div`
  margin-top: 12px;
  border-radius: 18px;
  padding: 20px;
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

export const CoreTitle = styled.h1`
  font-weight: bold;
  text-align: center;
  font-size: 34px;
  padding: 10px;
  margin: 0;
  color: #4b4a4a
`;

export const CoreButton = styled.button`
  width: 100%;
  background-color: transparent;
  padding-top: 3px;
  font-size: 28px;
  font-family: 'M PLUS Rounded 1c';
  border: none;
  outline: none;
  color: #4b4a4a;
  cursor: pointer;
  @media screen and (min-width: 350px) and (max-width: 520px) {
    font-size: 20px;
  }
`;

export const CoreSelectMenu = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 20px;
`;

export const CoreLogout = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
`;

export const CoreContainer = styled.div`
  padding: 20px;
`;

export const CoreStyledPagination = styled.div`
  margin: 30px auto 0px;
  @media (max-width: 520px) {
    margin: 30px auto 70px;
  }
  .paginationBttns {
    height: 40px;
    list-style: none;
    display: flex;
    justify-content: center;
  }

  .paginationBttns a {
    padding: 10px;
    margin: 8px;
    border-radius: 5px;
    border: 2px solid #ee442a;
    color: #fff;
    cursor: pointer;
  }

  .paginationBttns a:hover {
    color: #fff;
    background-color: #ee442a;
  }

  .paginationActive a {
    color: #fff;
    background-color: #ee442a;
  }

  .paginationDisabled a {
    display: none;
  }
`;
