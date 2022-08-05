import React, { useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import styles from "./Core.module.css";
import { File } from "../types";

import {
  selectOpenNewPost,
  resetOpenNewPost,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncNewPost,
} from "../post/postSlice";

import { Button, TextField, IconButton } from "@material-ui/core";
import { MdAddAPhoto } from "react-icons/md";



const customStyles = {
  content: {
    top: "55%",
    left: "50%",

    width: 380,
    height: 420,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const NewPost: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();


  const openNewPost = useSelector(selectOpenNewPost);

  const [image, setImage] = useState<File | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [description, setDescription] = useState("");
  const [accessStars, setAccessStars] = React.useState<number | null>(0);
  const [congestionDegree, setCongestionDegree] = React.useState<number | null>(0);
  

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

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
    dispatch(resetOpenNewPost());
  };

  return (
    <>
      <Modal
        isOpen={openNewPost}
        onRequestClose={async () => {
          await dispatch(resetOpenNewPost());
        }}
        style={customStyles}
      >
        <form className={styles.core_signUp}>
          <h1 className={styles.core_title}>SNS clone</h1>

          <br />
          <TextField
            placeholder="名所の名前を記入してください"
            type="text"
            onChange={(e) => setPlaceName(e.target.value)}
          />

          <TextField
            placeholder="名所の概要を記入して下さい"
            multiline={true}
            rows={3}
            rowsMax={4}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <Typography component="legend">アクセス</Typography>
            <Rating
              name="simple-controlled"
              defaultValue={0}
              value={accessStars}
              onChange={(event, newValue) => {
                setAccessStars(newValue);
              }}
            />
          </div>

          <div>
            <div>
              <Typography component="legend">混雑度</Typography>
              <Rating
                name="simple-controlled"
                defaultValue={0}
                value={congestionDegree}
                onChange={(event, newValue) => {
                  setCongestionDegree(newValue);
                }}
              />
            </div>
          </div>

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
          <Button
            disabled={!placeName || !image}
            variant="contained"
            color="primary"
            onClick={newPost}
          >
            New post
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default NewPost;
