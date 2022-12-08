import styled from "styled-components";

export const PostForm = styled.form`
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  background: #fff;
`;

export const PostFormWrapper = styled.div`
  max-width: 780px;
  height: 100vh;
  margin: auto;
  position: relative;
`;

export const PostTitle = styled.h1`
  font-weight: normal;
  text-align: center;
  font-size: 34px;
  padding: 10px;
  margin: 0;
  @media screen and (max-width: 520px) {
    font-size: 20px;
  }
`;

export const TagUl = styled.ul`
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0 2rem;
`;

export const TagList = styled.li`
  background-color: #2196f3;
  color: #fff;
  padding: 3px 10px;
  border-radius: 16px;
`;

export const TagInput = styled.input`
  border: 1px solid #4b4a4a;
  border-radius: 0.5rem;
  padding: 0.3rem;
`;

export const TagAddButton = styled.button`
  border-radius: 0.5rem;
  padding: 0.3rem 0.5rem;
  border: none;
  margin-left: 0.5rem;
  background-color: #2196f3;
  color: #fff;
`;
