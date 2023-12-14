import React, { memo } from "react";
import { NavWrapper, NavButton } from "./NavbarStyles";
import { Avatar } from "../../commonStyles/AvatarStyles";
import { AppDispatch } from "../../redux/app/store";
import { useDispatch } from "react-redux";
import {
  resetOpenProfile,
  setOpenSignIn,
  setOpenProfile,
  resetOpenSignUp,
  resetOpenSignIn,
  setOpenSignUp,
} from "../../redux/slices/auth/authSlice";
import { resetOpenNewPost } from "../../redux/slices/post/postSlice";
import { useNavigate } from "react-router";
import { PROPS_PROFILE } from "../../types";
import NoProfileImg from "../../assets/NoProfileImg.webp";
import { useLogout } from "../../hooks/useQueryHooks";

const Navbar: React.FC<PROPS_PROFILE> = memo(({ nickName, img }) => {
  const isProduction = process.env.NODE_ENV === "production";

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  function pushHome() {
    navigate("/post/create");
  }

  const logoutMutation = useLogout();
  return (
    <NavWrapper>
      {nickName ? (
        <>
          {/* for test */}
          {isProduction ? null : (
            <span style={{ display: "none" }} data-testid="myNickName">
              {nickName}
            </span>
          )}

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
            onClick={async () => {
              localStorage.removeItem("localJWT");
              dispatch(resetOpenProfile());
              dispatch(resetOpenNewPost());
              dispatch(setOpenSignIn());
              await logoutMutation.mutateAsync()
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
            {img ? (
              <Avatar src={img} alt="プロフィール画像" />
            ) : (
              <Avatar src={NoProfileImg} alt="プロフィール画像" />
            )}
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
