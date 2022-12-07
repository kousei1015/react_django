import React, { useEffect, useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";
import { Button, TextField, IconButton } from "@material-ui/core";
import { MdAddAPhoto } from "react-icons/md";

import {
  selectPostDetail,
  fetchAsyncEditPost,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncGetDetail,
} from "./postSlice";
import { ID } from "../types";
import {
  PostForm,
  PostFormWrapper,
  PostTitle,
  TagUl,
  TagList,
} from "./NewUpdatePostStyles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      height: "50px",
      padding: "15px",
      marginBottom: "35px",
    },
    typo: {
      marginTop: "25px",
      color: "#346751",
    },
  })
);

const UpdatePost: React.FC = () => {
  const classes = useStyles();
  const { id } = useParams<ID>();
  const dispatch: AppDispatch = useDispatch();
  const postDetail = useSelector(selectPostDetail);
  const [placeName, setPlaceName] = useState(postDetail.placeName);
  const [description, setDescription] = useState(postDetail.description);
  const [image, setImage] = useState<File | null>(null);
  const [accessStars, setAccessStars] = useState(postDetail.accessStars);
  const [congestionDegree, setCongestionDegree] = useState(
    postDetail.congestionDegree
  );
  const [userPost] = useState(postDetail.userPost);
  const [tags, setTags] = useState(postDetail.tags);
  const [tagInput, setTagInput] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTagInput(e.target.value);
  };
  
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  function pushHome() {
    navigate("/");
  }

  useEffect(() => {
    const fetchLoader = async () => {
      await dispatch(fetchAsyncGetDetail(id as string));
    };
    fetchLoader();
  }, []);

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  const addTag = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (tagInput === "") {
      return;
    }
    const newTag = {
      name: tagInput,
    };
    setTags((prev) => [...prev, newTag]);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((el, i) => i !== index))
  }

  const editPost = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const postUploadData = {
      id: id,
      placeName: placeName,
      description: description,
      img: image,
      accessStars: accessStars,
      congestionDegree: congestionDegree,
      tags: tags,
      userPost: userPost,
    };
    await dispatch(fetchPostStart());
    const result = await dispatch(fetchAsyncEditPost(postUploadData));
    await dispatch(fetchPostEnd());
    if (fetchAsyncEditPost.fulfilled.match(result)) {
      setMessage("編集成功");
      setPlaceName("");
      setDescription("");
      setImage(null);
      pushHome();
    } else if (fetchAsyncEditPost.rejected.match(result)) {
      setMessage(
        "エラ― 入力必須部分を記述していること、最大文字数が超えていないことをご確認ください"
      );
    }
  };

  return (
    <PostFormWrapper>
      <PostForm>
        <PostTitle data-testid="title">Update Page</PostTitle>
        <br />
        <Typography component="h6" color="error">
          {message}
        </Typography>

        <br />
        <TextField
          fullWidth
          defaultValue={postDetail.placeName}
          multiline={true}
          onChange={(e) => setPlaceName(e.target.value)}
          className={classes.textField}
          maxRows={2}
          helperText={`${placeName.length}/30`}
          placeholder="お気に入りの場所の名前を入力してください※入力必須 30文字まで"
        />

        <TextField
          fullWidth
          defaultValue={postDetail.description}
          maxRows={2}
          multiline={true}
          onChange={(e) => setDescription(e.target.value)}
          className={classes.textField}
          helperText={`${description.length}/200`}
          placeholder="その場所の説明を入力してください※入力必須 200文字まで"
        />

        <Typography className={classes.typo} component="h6">
          アクセス※入力必須
        </Typography>
        <Rating
          data-testid="access"
          name="simple-controlled"
          defaultValue={postDetail.accessStars}
          onChange={(e, newValue): void => {
            setAccessStars(newValue as number);
          }}
        />

        <Typography className={classes.typo} component="h6">
          混雑度※入力必須
        </Typography>
        <Rating
          data-testid="congestion"
          name="simple-controlled"
          defaultValue={postDetail.congestionDegree}
          onChange={(event, newValue) => {
            setCongestionDegree(newValue as number);
          }}
        />
        <Typography component="h6" className={classes.typo}>
          名所の画像※任意
        </Typography>
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

        <input
          type="text"
          value={tagInput}
          onChange={(e) => handleChange(e)}
          className="inputText"
        />
        <button onClick={addTag}>追加</button>
        <br />

        <TagUl>
          {tags.map((tag, index) => (
            <TagList key={index}>
              <span>{tag.name}</span>
              <span onClick={() => removeTag(index)}>&times;</span>
            </TagList>
          ))}
        </TagUl>

        <br />
        <Button data-testid="btn-update" onClick={editPost}>
          Edit
        </Button>
      </PostForm>
    </PostFormWrapper>
  );
};

export default UpdatePost;
