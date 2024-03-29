import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 100%;
  margin-bottom: 10px;
`;

export const Content = styled.div`
  text-align: center;
  background-color: #fff;
  border-radius: 28px;
  box-shadow: 3px 5px 10px #4b4a4a;
  padding-bottom: 1rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
`;

export const UserName = styled.h1`
  font-weight: 500;
  font-size: 1.2rem;
  margin-left: 10px;
`;
export const PlaceName = styled.p`
  font-size: 1.2rem;
  margin: 10px 0;
  @media (max-width: 520px) {
    font-size: 1.35rem;
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 270px;
  object-fit: contain;
  @media screen and (max-width: 520px) {
    height: 220px;
  }
  @media screen and (min-width: 520) and (max-width: 960px) {
    height: 350px;
  }
`;

export const Star = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TagUl = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0 2rem;
`;

export const TagList = styled.li`
  background-color: #2196f3;
  color: #fff;
  padding: 3px 12px;
  border-radius: 16px;
`;