import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AppDispatch } from "../../app/store";
import { Button, TextField, IconButton } from "@material-ui/core";
import { MdAddAPhoto } from "react-icons/md";
import { selectPostDetail, fetchAsyncEditPost, fetchAsyncGetDetail } from "../post/postSlice";
import { ID } from "./../types";
import { PostForm, PostFormWrapper, PostTitle } from "./NewUpdatePostStyles";
import { Form, FormWrapper } from "../../styles/Form";
import { Title } from "../../styles/Text";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    update_textField: {
      height: "50px",
      padding: "10px"
    },
  })
);

const UpdatePost: React.FC = () => {
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
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}api/post/${id}`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    console.log(res.data);
    setPlaceName(res.data.placeName);
    setDescription(res.data.description);
    setImage(res.data.image);
    setAccessStars(res.data.accessStars);
    setCongestionDegree(res.data.congestionDegree);
  };

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
    const postUploadData: any = {
      id: id,
      placeName: placeName,
      description: description,
      img: image,
      accessStars: accessStars,
      congestionDegree: congestionDegree,
      userPost: userPost,
    };
    dispatch(fetchAsyncEditPost(postUploadData));
    setPlaceName("");
    setDescription("");
    setImage(null);
    pushHome();
  };

  return (
    <PostFormWrapper>
      <PostForm>
        <PostTitle>Update Page</PostTitle>

        <br />
        <TextField
          multiline={true}
          fullWidth
          defaultValue={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          className={classes.update_textField}
        />

        <TextField
          multiline={true}
          fullWidth
          defaultValue={description}
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
        <Button onClick={handleSubmit}>Edit</Button>
      </PostForm>
    </PostFormWrapper>
  );
};

export default UpdatePost;
