import React from "react";
import {
  Wrapper,
  Content,
  Header,
  PlaceName,
  Image,
  Star,
  UserName,
  DetailButton,
  TagUl,
  TagList,
} from "./PostStyles";
import { Avatar, Button } from "@material-ui/core";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectProfiles } from "../auth/authSlice";
import { PROPS_POST } from "../types";

/* eslint-disable import/first */

const Post: React.FC<PROPS_POST> = ({
  postId,
  userPost,
  placeName,
  accessStars,
  congestionDegree,
  imageUrl,
  tags,
}) => {
  const profiles = useSelector(selectProfiles);
  const prof = profiles.filter((prof) => {
    return prof.userProfile === userPost;
  });

  const navigate = useNavigate();
  function pushDetailPage() {
    navigate(`/post/${postId}`);
  }
  if (placeName) {
    return (
      <Wrapper>
        <Content>
          <Header>
            <Avatar src={prof[0]?.img} />
            <UserName>{prof[0]?.nickName}</UserName>
          </Header>
          <Image src={imageUrl} alt="" />

          <PlaceName>{placeName}</PlaceName>
          <Star>
            <PlaceName>アクセス度</PlaceName>
            <Rating name="read-only" value={accessStars} readOnly />
          </Star>
          <Star>
            <PlaceName>　混雑度　</PlaceName>
            <Rating name="read-only" value={congestionDegree} readOnly />
          </Star>

          <TagUl>
            {tags.map((tag) => (
              <TagList
                key={tag.id}
              >
                <span>{tag.name}</span>
              </TagList>
            ))}
          </TagUl>

          <DetailButton
            onClick={pushDetailPage}
            data-testid={`detail-${postId}`}
          >
            詳細
          </DetailButton>
        </Content>
      </Wrapper>
    );
  }
  return null;
};

export default Post;
