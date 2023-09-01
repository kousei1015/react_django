import styled from "styled-components";

export const FormWrapper = styled.div`
  max-width: 780px;
  height: 100vh;
  margin: auto;
  position: relative;
`;

export const Form = styled.form`
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  background: #fff;
  padding: 0.5rem;
`;


export const TextField = styled.textarea`
    display: block;
    width: 90%;
    margin: 1rem auto;
    border: 2px solid gray;
    font-family: inherit;
`;

export const Text = styled.p`
  font-weight: normal;
  color: red;
`;

export const Title = styled.h1`
  font-weight: normal;
  text-align: center;
  font-size: 2rem;
  padding: 0.6rem;
  margin: 0;
  @media screen and (max-width: 520px) {
    font-size: 1.25rem;
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
  border-radius: 1rem;
`;

export const RemoveTagIcon = styled.span`
  padding-left: 0.5rem;
  cursor: pointer;
`

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
