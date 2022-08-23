import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 100%;
  margin-bottom: 10px;
`;

export const Content = styled.div`
  text-align: center;
  border-radius: 14px;
  background-color: #fff;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
`;

export const UserName = styled.h3`
  margin-left: 10px;
`;
export const PlaceName = styled.p`
  margin: 14px 0;
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

