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
  font-family: "Playball", cursive;
  font-weight: normal;
  text-align: center;
`;

export const CoreButton = styled.button`
  background-color: transparent;
  color: gray;
  padding-top: 3px;
  font-size: 28px;
  border: none;
  outline: none;
  cursor: pointer;
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`;

export const CoreLogout = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const CorePosts = styled.div`
  padding: 20px;
`;



export const CoreUpdateTitle = styled.h1`
  margin-top: 16px;
`;

export const CoreForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  margin: 20px 50px;
  border-radius: 20px;
`;

export const StyledPaginateContainer = styled.div`
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
