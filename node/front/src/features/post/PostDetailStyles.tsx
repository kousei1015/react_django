import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const Content = styled.div`
  max-width: 90%;
  margin: 0 auto;
  border: 1px solid lightgray;
  margin-bottom: 10px;
  background-color: white;
  margin-top: 22px;
  border-radius: 20px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
`;

export const UserName = styled.div`
  margin-left: 10px;
`;

export const ImageWrapper = styled.div`
  width: 100%;
`;

export const Image = styled.img`
  width: 75%;
  height: auto;
  display: block;
  margin: 0 auto;
`;

export const StarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Text = styled.p`
  font-size: 20px;
`;

export const Place = styled.div`
  padding: 36px 48px;
`;

export const Comments = styled.div`
  padding: 20px;
`;

export const Comment = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  word-break: break-all;
`;

export const CommentNickName = styled.strong`
  margin-right: 5px;
`;

export const CommentBox = styled.form`
  display: flex;
  margin-top: 10px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-top: 1px solid lightgray;
`;
export const CustomButton = styled.button`
  flex: 0;
  border: none;
  color: #4682b4;
  background-color: #fff;
  border-left: 1px black;
  cursor: pointer;
`;

