import styled from "styled-components";

export const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
`;

export const Content = styled.div`
  background-color: #F4FCD9;
  border-radius: 20px;
  border: 1px solid lightgray;
  max-width: 90%;
  margin: 22px auto 10px;
`;

export const Header = styled.div`
  align-items: center;
  display: flex;
  padding: 15px;
`;

export const UserName = styled.div`
  margin-left: 10px;
`;

export const ImageWrapper = styled.div`
  width: 100%;
`;

export const Image = styled.img`
  display: block;
  height: auto;
  margin: 0 auto;
  width: 70%;
`;

export const StarWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export const Text = styled.p`
  font-size: 16px;
  margin: 8px;
`;

export const Place = styled.div`
  margin: 30px 50px;
  text-align: center;
`;

export const Comments = styled.div`
  padding: 20px;
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
  margin: 15px 0;
`;

export const Input = styled.input`
  border: none;
  border-top: 1px solid lightgray;
  flex: 1;
  padding: 10px;
`;
export const CustomButton = styled.button`
  flex: 0;
  border: none;
  color: #4682b4;
  background-color: #F4FCD9;
  border-left: 1px black;
  cursor: pointer;
`;

export const ButtonFlex = styled.div`
  display: flex;
  justify-content: space-around;
`;