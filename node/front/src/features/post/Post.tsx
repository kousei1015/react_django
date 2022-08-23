import React from "react";
import { Wrapper, Content, Header, PlaceName, Image, Star, UserName } from "./PostStyles";
import { Avatar, Button } from "@material-ui/core";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
}) => {
  const profiles = useSelector(selectProfiles);
  const prof = profiles.filter((prof) => {
    return prof.userProfile === userPost;
  });

  if (placeName) {
    return (
      <Wrapper>
        <Content>
          <Header>
            <Avatar src={prof[0]?.img} />
            <UserName>{prof[0]?.nickName}</UserName>
          </Header>
          <Image src={imageUrl} alt="" />

          <PlaceName>名所:{placeName}</PlaceName>
          <Star>
            <p>アクセス度</p>
            <Rating name="read-only" value={accessStars} readOnly />
          </Star>
          <Star>
            <p>　混雑度　</p>
            <Rating name="read-only" value={congestionDegree} readOnly />
          </Star>
          <Link to={`/post/${postId}`}>
            <Button variant="contained" color="primary">
              詳細
            </Button>
          </Link>
        </Content>
      </Wrapper>
    );
  }
  return null;
};

export default Post;
