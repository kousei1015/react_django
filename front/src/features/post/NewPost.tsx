import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { AppDispatch } from "../../app/store";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { File } from "../types";
import { fetchPostStart, fetchPostEnd, fetchAsyncNewPost } from "./postSlice";
import { Button, TextField, IconButton } from "@material-ui/core";
import { MdAddAPhoto } from "react-icons/md";
import {
  PostForm,
  PostFormWrapper,
  PostTitle,
  TagUl,
  TagList,
  RemoveTagIcon,
  TagInput,
  TagAddButton,
} from "./NewUpdatePostStyles";
import { useNavigate } from "react-router-dom";
import { TAG } from "../types";
import imageCompression from "browser-image-compression";

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

const NewPost: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  const [image, setImage] = useState<File | null>(null);
  const option = {
    maxSizeMB: 1,
    maxWidthOrHeight: 400,
  };

  const [placeName, setPlaceName] = useState("");
  const [description, setDescription] = useState("");
  const [accessStars, setAccessStars] = useState<number | null>(0);
  const [congestionDegree, setCongestionDegree] = useState<number | null>(0);

  // for tags
  const [tags, setTags] = useState<TAG[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTagInput(e.target.value);
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
    setTags(tags.filter((el, i) => i !== index));
  };

  //useState for error message
  const [message, setMessage] = React.useState("");

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };
  const navigate = useNavigate();
  function pushHome() {
    navigate("/");
  }
  const newPost = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = {
      placeName: placeName,
      description: description,
      img: image,
      accessStars: accessStars,
      congestionDegree: congestionDegree,
      tags: tags,
    };
    await dispatch(fetchPostStart());
    const result = await dispatch(fetchAsyncNewPost(packet));
    await dispatch(fetchPostEnd());
    if (fetchAsyncNewPost.fulfilled.match(result)) {
      setMessage("投稿成功");
      setPlaceName("");
      setDescription("");
      setImage(null);
      pushHome();
    } else if (fetchAsyncNewPost.rejected.match(result)) {
      setMessage(
        "エラ― 入力必須部分を記述していること、最大文字数が超えていないことをご確認ください"
      );
    }
  };

  //for test easily
  function accessLabelText(value: any) {
    let text = "accessStar";
    if (value === 1) {
      text = "1 accessStar";
    } else if (value > 1) {
      text = value + "accessStars";
    }
    return text;
  }
  //for test easily
  function congestionLabelText(value: any) {
    let text = "congestionStar";
    if (value === 1) {
      text = "1 congestionStar";
    } else if (value > 1) {
      text = value + "congestionStars";
    }
    return text;
  }
  return (
    <PostFormWrapper>
      <PostForm>
        <PostTitle data-testid="title">Create Page</PostTitle>
        <br />
        <Typography component="h6" color="red">
          {message}
        </Typography>
        <br />
        <TextField
          placeholder="お気に入りの場所の名前を入力してください※入力必須 30文字まで"
          fullWidth
          multiline={true}
          onChange={(e) => setPlaceName(e.target.value)}
          maxRows={2}
          helperText={`${placeName.length}/30`}
          className={classes.textField}
        />

        <TextField
          placeholder="その場所の説明を入力してください※入力必須 200文字まで"
          fullWidth
          multiline={true}
          required={true}
          maxRows={2}
          onChange={(e) => setDescription(e.target.value)}
          helperText={`${description.length}/200`}
          className={classes.textField}
        />

        <Typography
          color="textSecondary"
          component="h6"
          className={classes.typo}
        >
          アクセス※入力必須
        </Typography>
        <Rating
          data-testid="access"
          name="simple-controlled"
          value={accessStars}
          getLabelText={accessLabelText}
          onChange={(e, newValue) => {
            setAccessStars(newValue);
          }}
        />

        <Typography
          color="textSecondary"
          component="h6"
          className={classes.typo}
        >
          混雑度※入力必須
        </Typography>
        <Rating
          data-testid="congestion"
          name="simple-controlled"
          value={congestionDegree}
          getLabelText={congestionLabelText}
          onChange={(event, newValue) => {
            setCongestionDegree(newValue);
          }}
        />
        <Typography
          color="textSecondary"
          component="h6"
          className={classes.typo}
        >
          名所の画像※任意
        </Typography>
        <input
          type="file"
          id="imageInput"
          hidden={true}
          onChange={
            async (e:any) => {
            if (!e.target.files[0]) {
              return;
            }
            const img = e.target.files[0];
            try {
              const comporessFile = await imageCompression(img, option)
              setImage(comporessFile)
            }
            catch(error) {
              console.log(error)
            }
            }
          }
        />
        <IconButton onClick={handlerEditPicture}>
          <MdAddAPhoto />
        </IconButton>
        <br />

        <TagInput
          type="text"
          value={tagInput}
          onChange={(e) => handleChange(e)}
          className="inputText"
        />
        <TagAddButton onClick={addTag}>追加</TagAddButton>
        <br />

        <TagUl>
          {tags?.map((tag, index) =>
            tag.name ? (
              <TagList key={index}>
                <span>{tag.name}</span>
                <RemoveTagIcon onClick={() => removeTag(index)}>&times;</RemoveTagIcon>
              </TagList>
            ) : (
              <></>
            )
          )}
        </TagUl>
        <br />
        <Button data-testid="btn-post" onClick={newPost}>
          Post
        </Button>
      </PostForm>
    </PostFormWrapper>
  );
};

export default NewPost;
