import styled from "styled-components";

export const CoreHeader = styled.div`
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

export const CoreTitle = styled.h1`
  font-weight: normal;
  text-align: center;
  font-size: 34px;
  padding: 10px;
  margin: 0;
  @media screen and (max-width: 520px) {
    font-size: 14px;
  }
`;

export const CoreButton = styled.button`
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

export const CoreLogout = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const CoreContainer = styled.div`
padding: 20px;
`;

export const CoreStyledPagination = styled.div`
  margin: 20px auto 0px;
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
    border: 1px solid #2b2eff;
    color: #2b2eff;
    cursor: pointer;
  }

  .paginationBttns a:hover {
    color: white;
    background-color: #2b2eff;
  }

  .paginationActive a {
    color: white;
    background-color: #2b2eff;
  }

  .paginationDisabled a {
    opacity: 0;
    cursor: default;
  }
`;


