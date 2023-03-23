import React, { memo } from "react";
import { NavWrapper, NavButton } from "./NavbarStyles";
import { Avatar } from "@material-ui/core";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import {
  resetOpenProfile,
  editNickname,
  setOpenSignIn,
  setOpenProfile,
  resetOpenSignUp,
  resetOpenSignIn,
  setOpenSignUp,
} from "../auth/authSlice";
import { resetOpenNewPost } from "../post/postSlice";
import { useNavigate } from "react-router";
import { PROPS_PROFILE } from "../types";

const Navbar: React.FC<PROPS_PROFILE> = memo(({nickName, img}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  function pushHome() {
    navigate("/post/create");
  }
  return (
    <NavWrapper>
      {localStorage.getItem("localJWT") ? (
        <>
          {/* for test */}
          <span style={{ display: "none" }}>{nickName}</span>
          
          <NavButton
            data-testid="btn-logout"
            onClick={() => {
              dispatch(resetOpenProfile());
              pushHome();
            }}
          >
            新規投稿
          </NavButton>
          <NavButton
            onClick={() => {
              localStorage.removeItem("localJWT");
              dispatch(editNickname(""));
              dispatch(resetOpenProfile());
              dispatch(resetOpenNewPost());
              dispatch(setOpenSignIn());
            }}
          >
            ログアウト
          </NavButton>
          <NavButton
            data-testid="edit-modal"
            onClick={() => {
              dispatch(setOpenProfile());
              dispatch(resetOpenNewPost());
            }}
          >
            <Avatar alt="who?" src={img} />
          </NavButton>
        </>
      ) : (
        <>
          <NavButton
            onClick={() => {
              dispatch(setOpenSignIn());
              dispatch(resetOpenSignUp());
            }}
          >
            ログイン
          </NavButton>
          <NavButton
            onClick={() => {
              dispatch(setOpenSignUp());
              dispatch(resetOpenSignIn());
            }}
          >
            新規登録
          </NavButton>
        </>
      )}
    </NavWrapper>
  );
});

export default Navbar;
