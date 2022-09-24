import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 100%;
  margin-bottom: 10px;
`;

export const Content = styled.div`
  text-align: center;
  border-radius: 14px;
  background-color: #F4FCD9;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
`;

export const UserName = styled.h3`
  font-weight: 500;
  margin-left: 10px;
`;
export const PlaceName = styled.p`
  margin: 10px 0;
`;

export const Image = styled.img`
  width: 100%;
  height: 270px;
  object-fit: contain;
  @media screen and (max-width: 520px) {
    height: 220px;
  }
  @media screen and (min-width: 520)and (max-width: 960px) {
    height: 350px;
  }
`;

export const Star = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DetailButton = styled.button`
  background-color: #28B5B5;
  border: 1px solid #28B5B5;
  border-radius: 16px;
  color: #F4FCD9;
  padding: 8px 16px;
  cursor: pointer;
  transition: 0.3s all ease-in-out;
  margin-bottom: 10px;
  &:hover {
    background-color: #346751;
    border: 1px solid #346751;
  }
`;
