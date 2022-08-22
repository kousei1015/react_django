import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { selectProfiles } from "../auth/authSlice";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Rating from "@mui/material/Rating";
import {
  selectComments,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncPostComment,
  fetchAsyncGetComments,
} from "./postSlice";
import { selectProfile } from "../auth/authSlice";
import {
  Wrapper,
  Content,
  Header,
  UserName,
  ImageWrapper,
  Image,
  StarWrapper,
  Text,
  Place,
  Comments,
  Comment,
  CommentNickName,
  CommentBox,
  Input,
  CustomButton,
} from "./PostDetailStyles";
import {
  fetchAsyncGetDetail,
  selectPostDetail,
  fetchAsyncDelete,
} from "./postSlice";
import { Button } from "@material-ui/core";
import { ID } from "../types";
import { fetchAsyncGetMyProf } from "../auth/authSlice";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  card: {
    width: "100%",
  },
  rate: {
    alignItems: "center",
  },
}));

const PostDetail: React.FC = () => {
  const { id } = useParams<ID>();
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const postDetail = useSelector(selectPostDetail);
  const profiles = useSelector(selectProfiles);
  const myProfile = useSelector(selectProfile);
  const comments = useSelector(selectComments);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const commentsOnPost = comments.filter((com) => {
    return com.post === postDetail.id;
  });

  const postComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { text: text, post: postDetail.id };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncPostComment(packet));
    await dispatch(fetchPostEnd());
    setText("");
  };

  function pushHome() {
    navigate("/");
  }

  useEffect(() => {
    const fetchLoader = async () => {
      await dispatch(fetchAsyncGetDetail(id as string));
      await dispatch(fetchAsyncGetComments());
      await dispatch(fetchAsyncGetMyProf());
    };
    fetchLoader();
  }, [dispatch]);

  return (
    <>
      <Wrapper>
        <Content>
          <Header>
            <Avatar src={postDetail.userPost.profile.img} />
            <UserName>{postDetail.userPost.profile.nickName}</UserName>
          </Header>

          <ImageWrapper>
            <Image src={postDetail.img} />
          </ImageWrapper>
          <StarWrapper>
            <Text>アクセス度</Text>
            <Rating name="read-only" value={postDetail.accessStars} readOnly />

            <Text>混雑度</Text>
            <Rating
              name="read-only"
              value={postDetail.congestionDegree}
              readOnly
            />
          </StarWrapper>
          <Place>
            名所:{postDetail.placeName}
            <br />
            説明:{postDetail.description}
          </Place>

          {postDetail.userPost.id === myProfile.userProfile ? (
            <>
              <Button
                size="small"
                color="secondary"
                onClick={() => {
                  dispatch(fetchAsyncDelete(postDetail.id));
                  pushHome();
                }}
              >
                <DeleteIcon fontSize="small" /> &nbsp; Delete
              </Button>
              <Button size="small">
                <Link to={`/post/${id}/update`}>
                  <EditIcon fontSize="small" /> Edit
                </Link>
              </Button>
            </>
          ) : (
            <>
              
            </>
          )}

          <Comments>
            {commentsOnPost.map((comment) => (
              <Comment key={comment.id}>
                <Avatar
                  src={
                    profiles.find(
                      (prof) => prof.userProfile === comment.userComment
                    )?.img
                  }
                  className={classes.small}
                />

                <p>
                  <CommentNickName>
                    {
                      profiles.find(
                        (prof) => prof.userProfile === comment.userComment
                      )?.nickName
                    }
                  </CommentNickName>
                  {comment.text}
                </p>
              </Comment>
            ))}
          </Comments>
        </Content>

        <CommentBox>
          <Input
            type="text"
            placeholder="add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <CustomButton
            disabled={!text.length}
            type="submit"
            onClick={postComment}
          >
            Post
          </CustomButton>
        </CommentBox>
      </Wrapper>
    </>
  );
};

export default PostDetail;
