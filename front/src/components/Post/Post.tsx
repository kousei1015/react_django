import React from "react";
import NoProfileImg from "../../assets/NoProfileImg.webp"
import {
  Wrapper,
  Content,
  Header,
  PlaceName,
  Image,
  Star,
  UserName,
  TagUl,
  TagList,
} from "./PostStyles";
import { Button } from "../../commonStyles/ButtonStyles";
import { Avatar } from "../../commonStyles/AvatarStyles";
import { useNavigate } from "react-router-dom";
import { PROPS_POST } from "../../types";
import Stars from "../Stars/Stars";

/* eslint-disable import/first */

const Post: React.FC<PROPS_POST> = ({
  id,
  userPost,
  placeName,
  accessStars,
  congestionDegree,
  img,
  tags,
  profiles,
}) => {
  const prof = profiles.filter((prof) => {
    return prof.userProfile === userPost;
  });

  const navigate = useNavigate();
  function pushDetailPage() {
    navigate(`/post/${id}`);
  }
  if (placeName) {
    return (
      <Wrapper>
        <Content>
          <Header>
            {prof[0]?.img ? (
              <Avatar src={prof[0]?.img} alt="投稿者の画像" />
            ) : (
              <Avatar src={NoProfileImg} alt="投稿者の画像" />
            )}
            <UserName>{prof[0]?.nickName}</UserName>
          </Header>
          <Image src={img} />

          <PlaceName>{placeName}</PlaceName>
          <Star>
            <PlaceName>アクセス度</PlaceName>
            <Stars value={accessStars} readOnly={true} />
          </Star>
          <Star>
            <PlaceName>　混雑度　</PlaceName>
            <Stars value={congestionDegree} readOnly={true} />
          </Star>

          <TagUl>
            {tags.map((tag) => (
              <TagList key={tag.id}>
                <span>{tag.name}</span>
              </TagList>
            ))}
          </TagUl>

          <Button onClick={pushDetailPage} data-testid={`detail-${id}`}>
            詳細
          </Button>
        </Content>
      </Wrapper>
    );
  }
  return null;
};

export default Post;
