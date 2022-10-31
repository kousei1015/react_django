import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { selectProfiles } from "../auth/authSlice";
import { useParams, useNavigate } from "react-router-dom";
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
import {
  selectProfile,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "../auth/authSlice";
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
  ButtonFlex
} from "./PostDetailStyles";
import {
  fetchAsyncGetDetail,
  selectPostDetail,
  fetchAsyncDelete,
} from "./postSlice";
import { Button, Typography } from "@material-ui/core";
import { ID } from "../types";

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
  const [message, setMessage] = useState("");
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
      //await dispatch(fetchAsyncGetDetail("1"));
      await dispatch(fetchAsyncGetMyProf());
      await dispatch(fetchAsyncGetComments());
      await dispatch(fetchAsyncGetProfs());
    };
    fetchLoader();
  }, [dispatch]);

  function pushEditPage() {
    navigate(`update`);
  }
  return (
    <>
      {/* for test to confirm render myprofile and postDetail data */}
      <span style={{ display: "none" }}>{myProfile.nickName}</span>
      <span style={{ display: "none" }}>{postDetail.placeName}</span>
      <Wrapper>
        <Content>
          <Header>
            <Avatar src={postDetail.userPost.profile.img} />
            <UserName>{postDetail.userPost.profile.nickName}</UserName>
          </Header>

          <ImageWrapper>
            <Image src={postDetail.img} />
          </ImageWrapper>
          <Place data-testid="place-name">名所:{postDetail.placeName}</Place>
          <Place data-testid="description">説明:{postDetail.description}</Place>
          <StarWrapper>
            <Text data-testid="access">アクセス度</Text>
            <Rating name="read-only" value={postDetail.accessStars} readOnly />
            <br />
            <Text data-testid="congestion">混雑度</Text>
            <Rating
              name="read-only"
              value={postDetail.congestionDegree}
              readOnly
            />
          </StarWrapper>

          <Typography component="h6" color="error">
            {message}
          </Typography>

          {postDetail.userPost.id === myProfile.userProfile ? (
            <ButtonFlex>
              <Button
                size="small"
                color="secondary"
                onClick={async () => {
                  const result = await dispatch(
                    fetchAsyncDelete(postDetail.id)
                  );
                  if (fetchAsyncDelete.fulfilled.match(result)) {
                    pushHome();
                    setMessage("削除成功");
                  }
                }}
              >
                <DeleteIcon fontSize="small" /> &nbsp; Delete
              </Button>
              <Button data-testid="edit" size="small" onClick={pushEditPage}>
                <EditIcon fontSize="small" /> Edit
              </Button>
            </ButtonFlex>
          ) : (
            <></>
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
            data-testid="post"
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