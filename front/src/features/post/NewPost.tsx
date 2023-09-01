import React, { useState } from "react";
import { File } from "../types";
import { Button } from "../../commonStyles/ButtonStyles";
import { MdAddAPhoto } from "react-icons/md";
import {
  Form,
  FormWrapper,
  TextField,
  Text,
  Title,
  TagUl,
  TagList,
  RemoveTagIcon,
  TagInput,
  TagAddButton,
} from "./NewUpdatePostStyles";
import { useNavigate } from "react-router-dom";
import { Tag } from "../types";
import imageCompression from "browser-image-compression";
import { useAddPost } from "../query/queryHooks";
import Stars from "../Stars";

const NewPost: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const option = {
    maxSizeMB: 5,
    maxWidthOrHeight: 400,
  };

  const [placeName, setPlaceName] = useState("");
  const [description, setDescription] = useState("");
  const [accessStars, setAccessStars] = useState(0);
  const [congestionDegree, setCongestionDegree] = useState(0);

  const addPostMutation = useAddPost();

  // for tags
  const [tags, setTags] = useState<Tag[]>([]);
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
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((el, i) => i !== index));
  };

  //useState for error message
  const [message, setMessage] = useState("");

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
      accessStars: accessStars.toString(),
      congestionDegree: congestionDegree.toString(),
      tags: tags,
    };
    try {
      await addPostMutation.mutateAsync(packet);
      setMessage("投稿成功");
      setPlaceName("");
      setDescription("");
      setImage(null);
      pushHome();
    } catch (error) {
      setMessage(
        "エラ― 入力必須部分を記述していること、最大文字数が超えていないことをご確認ください"
      );
    }
  };

  return (
    <>
      <FormWrapper>
        <Form>
          <Title data-testid="title">Create Page</Title>
          <Text>{message}</Text>
          <br />
          <TextField
            placeholder="お気に入りの場所の名前を入力してください※入力必須 30文字まで"
            onChange={(e) => setPlaceName(e.target.value)}
          />

          <TextField
            placeholder="その場所の説明を入力してください※入力必須 200文字まで"
            onChange={(e) => setDescription(e.target.value)}
          />

          <Text>アクセス※入力必須</Text>

          <div data-testid="access">
            <Stars value={accessStars} setValue={setAccessStars} readOnly={false} whichStar="access" />
          </div>

          <Text>混雑度※入力必須</Text>

          <div data-testid="congestion">
            <Stars value={congestionDegree} setValue={setCongestionDegree} readOnly={false} whichStar="congestion" />
          </div>

          <Text>名所の画像※任意</Text>
          <input
            type="file"
            id="imageInput"
            hidden={true}
            onChange={async (e: any) => {
              if (!e.target.files[0]) {
                return;
              }
              const img = e.target.files[0];
              try {
                const comporessFile = await imageCompression(img, option);
                setImage(comporessFile);
              } catch (error) {
                console.log(error);
              }
            }}
          />

          <MdAddAPhoto onClick={handlerEditPicture} />

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
                  <RemoveTagIcon onClick={() => removeTag(index)}>
                    &times;
                  </RemoveTagIcon>
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
        </Form>
      </FormWrapper>
    </>
  );
};

export default NewPost;
