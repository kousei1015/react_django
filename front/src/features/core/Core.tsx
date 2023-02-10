import React, { useState, useEffect } from "react";
import usePagination from "./usePagination";
import Auth from "../auth/Auth";
import Post from "../post/Post";
import EditProfile from "./EditProfile";
import {
  CoreHeader,
  CoreTitle,
  CoreButton,
  CoreSelectMenu,
  CoreLogout,
  CoreContainer,
  PaginateNav,
  PaginateButton,
} from "./CoreStyles";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { Button, Grid, Avatar, CircularProgress } from "@material-ui/core";

import {
  editNickname,
  selectProfile,
  selectIsLoadingAuth,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "../auth/authSlice";

import {
  selectPosts,
  selectIsLoadingPost,
  resetOpenNewPost,
  fetchAsyncGetPosts,
} from "../post/postSlice";

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const myProfile = useSelector(selectProfile);
  const posts = useSelector(selectPosts);
  const isLoadingPost = useSelector(selectIsLoadingPost);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const [orderType, setOrderType] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  function pushHome() {
    navigate("/post/create");
  }

  //アクセスがよい順にソート
  const accessAsc = [...posts.results].sort((a, b) =>
    a.accessStars < b.accessStars ? 1 : -1
  );
  //混雑が少ない場所順にソート
  const congestionAsc = [...posts.results].sort((a, b) =>
    a.congestionDegree < b.congestionDegree ? 1 : -1
  );
  useEffect(() => {
    const fetchLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
        const getPosts = dispatch(fetchAsyncGetPosts());
        const getProfs = dispatch(fetchAsyncGetProfs());
        await Promise.all([result, getPosts, getProfs])
      }
    };
    fetchLoader();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAsyncGetPosts(page));
  }, [page]);

  const pagesArray = Array(posts.total_pages)
    .fill(0)
    .map((_, index) => index + 1);

  const handleClick = (pg: string | number) => {
    if (typeof pg === "number") {
      return setPage(pg);
    }
    else return;
  };

  const { pagesFunc } = usePagination(pagesArray, page);
  const result = pagesFunc();



  return (
    <>
      <Auth />
      <EditProfile />
      <CoreHeader>
        {myProfile.nickName ? (
          <>
            <span style={{ display: "none" }}>{myProfile.nickName}</span>
            <CoreButton
              data-testid="btn-logout"
              onClick={() => {
                dispatch(resetOpenProfile());
                pushHome();
              }}
            >
              新規投稿
            </CoreButton>
            <CoreSelectMenu
              onChange={(e) => {
                const selectedOrderType: string = e.target.value;
                setOrderType(selectedOrderType);
              }}
            >
              <option value="" selected>
                新規投稿順
              </option>
              <option value="access">アクセスがよい順</option>
              <option value="congestion">混雑が少ない順</option>
            </CoreSelectMenu>
            <CoreLogout>
              {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
              <CoreButton
                onClick={() => {
                  localStorage.removeItem("localJWT");
                  dispatch(editNickname(""));
                  dispatch(resetOpenProfile());
                  dispatch(resetOpenNewPost());
                  dispatch(setOpenSignIn());
                }}
              >
                Logout
              </CoreButton>
              <CoreButton
                data-testid="edit-modal"
                onClick={() => {
                  dispatch(setOpenProfile());
                  dispatch(resetOpenNewPost());
                }}
              >
                <Avatar alt="who?" src={myProfile.img} />{" "}
              </CoreButton>
            </CoreLogout>
          </>
        ) : (
          <div>
            <Button
              onClick={() => {
                dispatch(setOpenSignIn());
                dispatch(resetOpenSignUp());
              }}
            >
              LogIn
            </Button>
            <Button
              onClick={() => {
                dispatch(setOpenSignUp());
                dispatch(resetOpenSignIn());
              }}
            >
              SignUp
            </Button>
          </div>
        )}
      </CoreHeader>

      {myProfile?.nickName && (
        <>
          <CoreTitle>Map Collection</CoreTitle>
          <CoreContainer>
            <div>
              {orderType === "" && (
                <Grid container spacing={4}>
                  {posts.results.map((post) => (
                    <Grid key={post.id} item xs={12} md={4}>
                      <Post
                        postId={post.id}
                        placeName={post.placeName}
                        description={post.description}
                        loginId={myProfile.userProfile}
                        userPost={post.userPost}
                        imageUrl={post.img}
                        accessStars={post.accessStars}
                        congestionDegree={post.congestionDegree}
                        tags={post.tags}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
              {orderType === "access" && (
                <Grid container spacing={4}>
                  {accessAsc.map((post) => (
                    <Grid key={post.id} item xs={12} md={4}>
                      <Post
                        postId={post.id}
                        placeName={post.placeName}
                        description={post.description}
                        loginId={myProfile.userProfile}
                        userPost={post.userPost}
                        imageUrl={post.img}
                        accessStars={post.accessStars}
                        congestionDegree={post.congestionDegree}
                        tags={post.tags}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
              {orderType === "congestion" && (
                <Grid container spacing={4}>
                  {congestionAsc.map((post) => (
                    <Grid key={post.id} item xs={12} md={4}>
                      <Post
                        postId={post.id}
                        placeName={post.placeName}
                        description={post.description}
                        loginId={myProfile.userProfile}
                        userPost={post.userPost}
                        imageUrl={post.img}
                        accessStars={post.accessStars}
                        congestionDegree={post.congestionDegree}
                        tags={post.tags}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </div>
            <PaginateNav>
              {result?.map((pg) => (
                <PaginateButton onClick={() => handleClick(pg)} key={pg} active={page === Number(pg) ? true: false}>
                  {pg}
                </PaginateButton>
              ))}
            </PaginateNav>
          </CoreContainer>
        </>
      )}
    </>
  );
};

export default Core;
