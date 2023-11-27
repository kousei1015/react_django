import styled from "styled-components";

export const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
`;

export const Content = styled.div`
  background-color: #fff;
  border-radius: 1.25rem;
  border: 1px solid lightgray;
  max-width: 90%;
  margin: 1.4rem auto 0.6rem;
`;

export const Header = styled.div`
  align-items: center;
  display: flex;
  padding: 1rem;
`;

export const UserName = styled.div`
  margin-left: 0.6rem;
  font-size: 1.5rem;
`;

export const Image = styled.img`
  display: block;
  height: auto;
  margin: 0 auto;
  width: 70%;
`;

export const StarWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const Text = styled.p`
  text-align: center;
  margin: 0.5rem;
  font-size: 1.2rem;
`;

export const Place = styled.div`
  margin: 1.9rem 3rem;
  text-align: center;
  font-size: 1.2rem;
  letter-spacing: 1.2px;
  @media (max-width: 520px) {
    font-size: 1.35rem;
  }
`;

export const Comments = styled.div`
  padding: 1.25rem;
`;

export const Comment = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 5px;
  word-break: break-all;
`;

export const CommentNickName = styled.strong`
  margin-right: 5px;
`;

export const CommentBox = styled.form`
  display: flex;
  margin: 1rem 0;
`;

export const Input = styled.input`
  border: none;
  border-top: 1px solid lightgray;
  flex: 1;
  padding: 0.6rem;
`;
export const CustomButton = styled.button`
  flex: 0;
  border: none;
  color: #4682b4;
  background-color: #f4fcd9;
  border-left: 1px black;
  cursor: pointer;
`;

export const ButtonFlex = styled.div`
  display: flex;
  justify-content: space-around;
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

export const UnAuthorizedMessage = styled.h3`
  display: flex;
  justify-content: center;
  color: black;
`;
