import styled, { keyframes } from "styled-components";

export const animation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 10px }
  100% { margin-bottom: 0 }
`;

export const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DotWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const Dot = styled.span<{delay: string}>`
  background-color: #4b4a4a;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  margin: 0 7px;
  animation: ${animation} 1.2s linear infinite;
  animation-delay: ${props => props.delay};
`;

export const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
`;

export const Content = styled.div`
  background-color: #fff;
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
  font-size: 1.5rem;
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
  margin: 8px;
  font-size: 1.2rem;
`;

export const Place = styled.div`
  margin: 30px 50px;
  text-align: center;
  font-size: 1.2rem;
  letter-spacing: 1.2px;
  @media (max-width: 520px) {
    font-size: 1.35rem;
  }
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
  border-radius: 16px;
`;
