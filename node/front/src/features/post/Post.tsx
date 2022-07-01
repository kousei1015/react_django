import React from "react";
import styles from "./Post.module.css";
import { Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectProfiles } from "../auth/authSlice";
import Button from "@material-ui/core/Button";
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
      <div className={styles.post}>
        <div className={styles.post_child}>
          <div className={styles.post_header}>
            <Avatar className={styles.post_avatar} src={prof[0]?.img} />
            <h3>{prof[0]?.nickName}</h3>
          </div>
          <img className={styles.post_image} src={imageUrl} alt="" />

          <p>名所:{placeName}</p>
          <div className={styles.post_star}>
            <p>アクセス度</p>
            <Rating name="read-only" value={accessStars} readOnly />
          </div>
          <div className={styles.post_star}>
            <p>混雑度</p>
            <Rating name="read-only" value={congestionDegree} readOnly />
          </div>
          <Link to={`/post/${postId}`}>
            <Button variant="contained" color="primary">
              詳細
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  return null;
};

export default Post;
