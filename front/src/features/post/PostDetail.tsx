import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Rating from "@mui/material/Rating";

import {
  selectComments,
  selectIsLoadingPost,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncPostComment,
  fetchAsyncGetComments,
  fetchAsyncDeleteComment,
} from "./postSlice";
import {
  selectProfile,
  fetchAsyncGetMyProf,
} from "../auth/authSlice";
import {
  Wrapper,
  Content,
  Header,
  UserName,
  Image,
  StarWrapper,
  Text,
  Place,
  Comments,
  Comment,
  CommentNickName,
  CommentBox,
  UnAuthorizedMessage,
  Input,
  CustomButton,
  ButtonFlex,
  TagUl,
  TagList,
} from "./PostDetailStyles";
import { LoadingScreen, DotWrapper, Dot } from "../../styles/LoadingStyles";
import {
  fetchAsyncGetDetail,
  selectPostDetail,
  fetchAsyncDelete,
} from "./postSlice";
import { Button, Typography } from "@material-ui/core";

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
  const { id } = useParams();
  const idAsNumber = id ? parseInt(id, 10) : NaN;
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const postDetail = useSelector(selectPostDetail);
  const myProfile = useSelector(selectProfile);
  const comments = useSelector(selectComments);
  const postsLoading = useSelector(selectIsLoadingPost);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const commentsOnPost = comments.filter((com) => {
    return com.post === postDetail.id;
  });

  const postComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { text: text, post: postDetail.id };
    await dispatch(fetchAsyncPostComment(packet));
    setText("");
  };

  function pushHome() {
    navigate("/");
  }

  useEffect(() => {
    const fetchLoader = async () => {
      if (isNaN(idAsNumber)) {
        throw new Error("idが数値ではありません。");
      } else {
        dispatch(fetchPostStart());
        await Promise.all([
          dispatch(fetchAsyncGetDetail(idAsNumber)),
          dispatch(fetchAsyncGetMyProf()),
          dispatch(fetchAsyncGetComments()),
        ]);
        dispatch(fetchPostEnd());
      }
    };
    fetchLoader();
  }, [dispatch]);

  function pushEditPage() {
    navigate(`update`);
  }
  return (
    <>
      {postsLoading ? (
        <LoadingScreen>
          <h1>Loading</h1>
          <DotWrapper>
            <Dot delay="0s" />
            <Dot delay=".3s" />
            <Dot delay=".5s" />
          </DotWrapper>
        </LoadingScreen>
      ) : (
        <>
          {/* for test to confirm render myprofile and postDetail data */}
          <span style={{ display: "none" }}>{postDetail.placeName}</span>
          <Wrapper>
            <Content>
              <Header>
                <Avatar src={postDetail.profileImage} />
                <UserName>{postDetail.nickName}</UserName>
              </Header>

              <div>
                <Image src={postDetail.img} />
              </div>
              <Place data-testid="place-name">
                名所:{postDetail.placeName}
              </Place>
              <Place data-testid="description">
                説明:{postDetail.description}
              </Place>
              <StarWrapper>
                <Text data-testid="access">アクセス度</Text>
                <Rating
                  name="read-only"
                  value={postDetail.accessStars}
                  readOnly
                />
                <br />
                <Text data-testid="congestion">混雑度</Text>
                <Rating
                  name="read-only"
                  value={postDetail.congestionDegree}
                  readOnly
                />
              </StarWrapper>

              <TagUl>
                {postDetail.tags.map((tag, index) => (
                  <TagList key={index}>
                    <span data-testid="tag-name">{tag.name}</span>
                  </TagList>
                ))}
              </TagUl>

              <Typography component="h6" color="error">
                {message}
              </Typography>

              {postDetail.userPost === myProfile.userProfile ? (
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
                    <DeleteIcon fontSize="small" data-testid="delete" /> 削除
                  </Button>
                  <Button size="small" onClick={pushEditPage}>
                    <EditIcon fontSize="small" data-testid="edit" /> 編集
                  </Button>
                </ButtonFlex>
              ) : (
                <></>
              )}

              <Comments>
                {commentsOnPost.map((comment) => (
                  <Comment key={comment.id}>
                    <Avatar
                      src={comment.profileImage}
                      className={classes.small}
                    />

                    <p>
                      <CommentNickName>
                        {comment.nickName}
                      </CommentNickName>
                      {comment.text}
                    </p>
                    {myProfile.userProfile === comment.userComment ? (
                      <Button
                        color="secondary"
                        onClick={async () => {
                          await dispatch(fetchAsyncDeleteComment(comment.id));
                        }}
                      >
                        コメント削除
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Comment>
                ))}
              </Comments>
            </Content>

            {localStorage.getItem("localJWT") ? (
              <CommentBox>
                <Input
                  type="text"
                  placeholder="add a comment"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <CustomButton
                  data-testid="post"
                  disabled={!text.length || !localStorage.getItem("localJWT")}
                  type="submit"
                  onClick={postComment}
                >
                  Post
                </CustomButton>
              </CommentBox>
            ) : (
              <UnAuthorizedMessage>
                コメントをするにはログインして下さい
              </UnAuthorizedMessage>
            )}
          </Wrapper>
        </>
      )}
    </>
  );
};

export default PostDetail;
