import React, { useState } from "react";
import Modal from "react-modal";
import { EditTitle, EditForm } from "./EditProfileStyles";
import { Button } from "../../commonStyles/ButtonStyles";
import { Input } from "../../commonStyles/InputStyles";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/app/store";
import { File, PROPS_PROFILE } from "../../types";
import {
  selectOpenProfile,
  resetOpenProfile,
} from "../../redux/slices/auth/authSlice";
import { MdAddAPhoto } from "react-icons/md";
import { usePutProfileMutation } from "../../hooks/useQueryHooks";

const modalStyles = {
  overlay: {
    backgroundColor: "#777777",
  },
  content: {
    top: "55%",
    left: "50%",
    width: 320,
    height: 370,
    padding: "0px",
    transform: "translate(-50%, -50%)",
  },
};

const EditProfile: React.FC<PROPS_PROFILE> = ({ id, nickName }) => {
  const putProfileMutation = usePutProfileMutation();
  const dispatch: AppDispatch = useDispatch();
  const openProfile = useSelector(selectOpenProfile);
  const [myNickName, setMyNickName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (id && nickName) {
      const packet = { id, nickName: myNickName, img: image };
      await putProfileMutation.mutateAsync(packet);
    }
    dispatch(resetOpenProfile());
  };

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  return (
    <>
      <Modal
        isOpen={openProfile}
        onRequestClose={() => {
          dispatch(resetOpenProfile());
        }}
        style={modalStyles}
      >
        <EditForm>
          <EditTitle>Map Collection</EditTitle>
          <>
            <br />
            <Input
              placeholder="nickname"
              type="text"
              value={myNickName}
              onChange={(e) => setMyNickName(e.target.value)}
            />
            <br />
            <input
              type="file"
              id="imageInput"
              hidden={true}
              onChange={(e) => setImage(e.target.files![0])}
            />
            <br />

            <MdAddAPhoto onClick={handlerEditPicture} />

            <br />
            <br />
            <Button disabled={!nickName} type="submit" onClick={updateProfile}>
              Update
            </Button>
          </>
        </EditForm>
      </Modal>
    </>
  );
};

export default EditProfile;
