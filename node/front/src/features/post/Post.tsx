import React, { useState } from "react";
import CardHeader from '@mui/material/CardHeader';
import styles from "./Post.module.css";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Divider } from "@material-ui/core";
import Rating from "@mui/material/Rating";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { Link } from "react-router-dom";
import { selectProfiles } from "../auth/authSlice";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Button } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import {
  selectComments,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncPostComment,
} from "./postSlice";

import { PROPS_POST } from "../types";
import TextareaAutosize from '@mui/base/TextareaAutosize';

/* eslint-disable import/first */
const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));

{
  /*ここで読み取らせる */
}
const Post: React.FC<PROPS_POST> = ({
  postId,
  userPost,
  placeName,
  description,
  access_stars,
  congestion_degree,
  imageUrl,
}) => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const profiles = useSelector(selectProfiles);
  const comments = useSelector(selectComments);
  const [text, setText] = useState("");

  const commentsOnPost = comments.filter((com) => {
    return com.post === postId;
  });

  const prof = profiles.filter((prof) => {
    return prof.userProfile === userPost;
  });

  const postComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { text: text, post: postId };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncPostComment(packet));
    await dispatch(fetchPostEnd());
    setText("");
  };

  if (placeName) {
    return (

        <div className={styles.post}>
          <div className={styles.post_header}>
            <Avatar className={styles.post_avatar} src={prof[0]?.img} />
            <h3>{prof[0]?.nickName}</h3>
          </div>
          <img className={styles.post_image} src={imageUrl} alt="" />

          <p>{placeName}</p>
          <p>{postId}</p>
          {/*ここでdescriptionが出ないのはpostSliceで設定したapiのurlのpathによる */}
          <p>{description}</p>
          <p>
            アクセス度
            <Rating name="read-only" value={access_stars} readOnly />
          </p>
          <p>
            混雑度
            <Rating name="read-only" value={congestion_degree} readOnly />
          </p>
          <Link to={`/post/${postId}`}>
            <Button variant="contained">詳細</Button>
          </Link>
          <Divider />
          <div className={styles.post_comments}>
            {commentsOnPost.map((comment) => (
              <div key={comment.id} className={styles.post_comment}>
                <Avatar
                  src={
                    profiles.find(
                      (prof) => prof.userProfile === comment.userComment
                    )?.img
                  }
                  className={classes.small}
                />

                <p>
                  <strong className={styles.post_strong}>
                    {
                      profiles.find(
                        (prof) => prof.userProfile === comment.userComment
                      )?.nickName
                    }
                  </strong>
                  {comment.text}
                </p>
              </div>
            ))}
          </div>

          <form className={styles.post_commentBox}>
            <input
              className={styles.post_input}
              type="text"
              placeholder="add a comment"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              disabled={!text.length}
              className={styles.post_button}
              type="submit"
              onClick={postComment}
            >
              Post
            </button>
          </form>
        </div>
    
    );
  }
  return null;
};

export default Post;
