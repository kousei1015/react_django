import React, { useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { FaStar } from "react-icons/fa";

import styles from "./Core.module.css";
import TextareaAutosize from "@mui/base/TextareaAutosize";
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

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};

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
  const [access_stars, setAccess_stars] = useState(0);
  const [congestion_degree, setCongestion_degree] = useState(0);
  const [hover, setHover] = useState(undefined);
  const stars = Array(5).fill(0);

  const handleMouseLeave = () => {
    setHover(undefined);
  };

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
      access_stars: access_stars,
      congestion_degree: congestion_degree,
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
            placeholder="Please enter caption"
            type="text"
            onChange={(e) => setPlaceName(e.target.value)}
          />

          <TextField
            placeholder="please input..."
            multiline={true}
            rows={3}
            rowsMax={4}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <p>アクセス</p>
            {stars.map((_, index) => {
              return (
                <FaStar
                  key={index}
                  size={24}
                  onClick={() => setAccess_stars(index + 1)}
                  onMouseLeave={handleMouseLeave}
                  color={
                    (hover || access_stars) > index
                      ? colors.orange
                      : colors.grey
                  }
                  style={{
                    marginRight: 10,
                    cursor: "pointer",
                  }}
                />
              );
            })}
          </div>

          <div>
            <p>混雑度</p>
            {stars.map((_, index) => {
              return (
                <FaStar
                  key={index}
                  size={24}
                  onClick={() => setCongestion_degree(index + 1)}
                  onMouseLeave={handleMouseLeave}
                  color={
                    (hover || congestion_degree) > index
                      ? colors.orange
                      : colors.grey
                  }
                  style={{
                    marginRight: 10,
                    cursor: "pointer",
                  }}
                />
              );
            })}
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
