import styled from "styled-components";

export const EditTitle = styled.h1`
  font-weight: normal;
  text-align: center;
  font-size: 34px;
  padding: 10px;
  margin: 0;
  @media screen and (max-width: 520px) {
    font-size: 20px;
  }
`;

export const EditForm = styled.form`
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  background: #fff;
  border-radius: 12px;
`;
