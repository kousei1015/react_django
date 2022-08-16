import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { AppDispatch } from "../../app/store";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { File } from "../types";
import {
  resetOpenNewPost,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncNewPost,
} from "../post/postSlice";
import { Button, TextField, IconButton } from "@material-ui/core";
import { MdAddAPhoto } from "react-icons/md";
import { CoreForm, CoreTitle } from "./CoreStyles";
import { useNavigate } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    update_textField: {
      width: "50%",
      "@media (max-width:480px)": {
        width: "100%",
      },
    },
  })
);

const ModifiedNewPost = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const [image, setImage] = useState<File | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [description, setDescription] = useState("");
  const [accessStars, setAccessStars] = React.useState<number | null>(0);
  const [congestionDegree, setCongestionDegree] = React.useState<number | null>(
    0
  );
  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };
  const navigate = useNavigate();
  function pushHome() {
    navigate('/')
  }
  const newPost = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = {
      placeName: placeName,
      description: description,
      img: image,
      accessStars: accessStars,
      congestionDegree: congestionDegree,
    };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncNewPost(packet));
    await dispatch(fetchPostEnd());
    setPlaceName("");
    setDescription("");
    setImage(null);
    pushHome();
  };
  return (
    <CoreForm>
      <CoreTitle>Update Page</CoreTitle>
      <br />
      <TextField
        placeholder="お気に入りの名前を入力してください"
        multiline={true}
        onChange={(e) => setPlaceName(e.target.value)}
        className={classes.update_textField}
      />

      <TextField
        placeholder="その場所の説明を入力してください"
        multiline={true}
        rowsMax={5}
        onChange={(e) => setDescription(e.target.value)}
        className={classes.update_textField}
      />

      <Typography component="legend">アクセス</Typography>
      <Rating
        name="simple-controlled"
        value={accessStars}
        onChange={(e, newValue) => {
          setAccessStars(newValue);
        }}
      />

      <Typography component="legend">混雑度</Typography>
      <Rating
        name="simple-controlled"
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
      <Button onClick={newPost}>Edit</Button>
    </CoreForm>
  );
};

export default ModifiedNewPost;
