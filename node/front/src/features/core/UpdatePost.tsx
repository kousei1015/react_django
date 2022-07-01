import React, { useEffect, useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AppDispatch } from "../../app/store";
import { Button, TextField, IconButton } from "@material-ui/core";
import { MdAddAPhoto } from "react-icons/md";
import {
  fetchAsyncGetDetail,
  selectPostDetail,
  fetchEditPost,
} from "../post/postSlice";
import { ID } from "./../types";
import API from "../post/api";
import styles from "./Core.module.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    update_textField: {
      width: "50%",
      "@media (max-width:480px)": {
        width: "100%",
      }
    },

  })
);

const UpdatePost = () => {
  const classes = useStyles();
  const { id } = useParams<ID>();
  const postDetail = useSelector(selectPostDetail);
  const [placeName, setPlaceName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [accessStars, setAccessStars] = useState<number | null>(null);
  const [congestionDegree, setCongestionDegree] = React.useState<number | null>(
    null
  );
  const [userPost] = useState(postDetail.userPost);

  useEffect(() => {
    API.get(`post/${id}`).then((res) => {
      console.log(res.data);

      setPlaceName(res.data.placeName);
      setDescription(res.data.description);
      setImage(res.data.image);
      setAccessStars(res.data.accessStars);
      setCongestionDegree(res.data.congestionDegree);
    });
  });

  const navigate = useNavigate();
  function pushHome() {
    navigate("/");
  }

  const dispatch: AppDispatch = useDispatch();
  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const EditPost: any = {
      placeName: placeName,
      description: description,
      image: image,
      accessStars: accessStars,
      congestionDegree: congestionDegree,
      userPost: userPost,
    };

    dispatch(fetchEditPost({ id, EditPost }));
    setPlaceName("");
    setDescription("");
    setImage(null);
    pushHome();
  };

  useEffect(() => {
    const fetchLoader = async () => {
      await dispatch(fetchAsyncGetDetail(id as string));
    };
    fetchLoader();
  }, []);

  return (
    <form className={styles.core_update}>
      
      <h1 className={styles.core_update_title}>Update Page</h1>

      <br />
        <TextField
          multiline={true}
          defaultValue={postDetail.placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          className={classes.update_textField}
        />

        <TextField
          multiline={true}
          defaultValue={postDetail.description}
          rowsMax={5}
          onChange={(e) => setDescription(e.target.value)}
          className={classes.update_textField}
        />

        
          <Typography component="legend">アクセス</Typography>
          <Rating
            name="simple-controlled"
            value={accessStars}
            defaultValue={postDetail.accessStars}
            onChange={(e, newValue) => {
              setAccessStars(newValue);
            }}
          />
        
        <Typography component="legend">混雑度</Typography>
        <Rating
          name="simple-controlled"
          defaultValue={postDetail.congestionDegree}
          value={congestionDegree}
          onChange={(event, newValue) => {
            setCongestionDegree(newValue);
          }}
        />

        <input
          type="file"
          id="imageInput"
          hidden={true}
          onChange={(e) => setImage(e.target.files![0])}
        />
        <br />
        <IconButton onClick={handlerEditPicture}>
          <MdAddAPhoto />
        </IconButton>
        <br />
        <Button onClick={handleSubmit}>Edit</Button>
      
    </form>
  );
};

export default UpdatePost;
