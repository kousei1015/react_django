import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdAddAPhoto } from "react-icons/md";
import {
  Form,
  FormWrapper,
  Title,
  TextField,
  Text,
  TagUl,
  TagList,
  TagInput,
  TagAddButton,
  RemoveTagIcon,
} from "./NewUpdatePostStyles";
import { Button } from "../commonStyles/ButtonStyles";
import { usePost, useUpdatePost } from "../hooks/useQueryHooks";
import { Tag } from "../types";
import Stars from "../components/Stars/Stars";

const UpdatePost: React.FC = () => {
  const { id } = useParams();
  const [placeName, setPlaceName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [accessStars, setAccessStars] = useState(0);
  const [congestionDegree, setCongestionDegree] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<Tag[]>([{ name: "" }]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTagInput(e.target.value);
  };

  const { data: post } = usePost(Number(id));
  const updatePostMutation = useUpdatePost();
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  function pushHome() {
    navigate("/");
  }

  useEffect(() => {
    if (post) {
      setPlaceName(post.placeName);
      setDescription(post.description);
      setAccessStars(post.accessStars);
      setCongestionDegree(post.congestionDegree);
      setTags(post.tags);
    }
  }, [post]);

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
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const editPost = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = {
      id: Number(id),
      placeName,
      description,
      img: image,
      accessStars: accessStars.toString(),
      congestionDegree: congestionDegree.toString(),
      tags,
    };
    try {
      await updatePostMutation.mutateAsync(packet);
      setMessage("編集成功");
      pushHome();
    } catch (err) {
      setMessage(
        "エラ― 入力必須部分を記述していること、最大文字数が超えていないことをご確認ください"
      );
    }
  };

  return (
    <>
      <FormWrapper>
        <Form>
          <Title data-testid="title">Update Page</Title>
          <Text>{message}</Text>

          <br />
          <TextField
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder="お気に入りの場所の名前を入力してください※入力必須 30文字まで"
          />

          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="その場所の説明を入力してください※入力必須 200文字まで"
          />

          <Text>アクセス※入力必須</Text>
          <div data-testid="access">
            <Stars
              value={accessStars}
              setValue={setAccessStars}
              readOnly={false}
              whichStar="access"
            />
          </div>

          <Text>混雑度※入力必須</Text>
          <div data-testid="congestion">
            <Stars
              value={congestionDegree}
              setValue={setCongestionDegree}
              readOnly={false}
              whichStar="congestion"
            />
          </div>

          <Text>名所の画像※任意</Text>
          <input
            type="file"
            id="imageInput"
            hidden={true}
            onChange={(e) => setImage(e.target.files![0])}
          />
          <br />
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
            {tags.map((tag, index) => (
              <TagList key={index}>
                <span>{tag.name}</span>
                <RemoveTagIcon onClick={() => removeTag(index)}>
                  &times;
                </RemoveTagIcon>
              </TagList>
            ))}
          </TagUl>

          <br />
          <Button data-testid="btn-update" onClick={editPost}>
            Edit
          </Button>
        </Form>
      </FormWrapper>
    </>
  );
};

export default UpdatePost;
