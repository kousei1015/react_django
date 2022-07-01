/* eslint-disable import/first */
import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchAsyncGetProfs, selectProfiles } from "../auth/authSlice";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Rating from "@mui/material/Rating";
import { Divider } from "@material-ui/core";
import {
  selectComments,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncPostComment,
  fetchAsyncGetComments,
} from "./postSlice";
import styles from "./PostDetail.module.css";
import {
  fetchAsyncGetDetail,
  selectPostDetail,
  fetchDeletePost,
} from "../post/postSlice";
import { Button } from "@material-ui/core";
import { ID } from "./../types";
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

const PostDetail: React.FC = ({}) => {
  const { id } = useParams<ID>();
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const postDetail = useSelector(selectPostDetail);
  const profiles = useSelector(selectProfiles);
  const comments = useSelector(selectComments);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const commentsOnPost = comments.filter((com) => {
    return com.post === postDetail.id;
  });

  const prof = profiles.filter((prof) => {
    return prof.userProfile === postDetail.userPost;
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
      if (id) {
        await dispatch(fetchAsyncGetDetail(id));
        await dispatch(fetchAsyncGetProfs());
        await dispatch(fetchAsyncGetComments());
      }
    };
    fetchLoader();
  }, [dispatch]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.post}>
          <div className={styles.post_header}>
            <Avatar className={styles.post_avatar} src={prof[0]?.img} />
            <h3>{prof[0]?.nickName}</h3>
          </div>

          <div className="postimg">
            <img src={postDetail.img} className={styles.detail_img} />
          </div>
          <div className={styles.detail_block}>
            <p className={styles.detail_text}>アクセス度</p>
            <Rating name="read-only" value={postDetail.accessStars} readOnly />

            <p className={styles.detail_text}>混雑度</p>
            <Rating
              name="read-only"
              value={postDetail.congestionDegree}
              readOnly
            />
          </div>
          <div className={styles.detail_place_name}>
            名所:{postDetail.placeName}
            <br />
            説明:{postDetail.description}
          </div>

          <Button
            size="small"
            color="secondary"
            onClick={() => {
              dispatch(fetchDeletePost(postDetail.id));
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
    </>
  );
};

export default PostDetail;
