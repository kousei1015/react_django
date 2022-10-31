import styled from "styled-components";

export const StyledPagination = styled.div`
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
