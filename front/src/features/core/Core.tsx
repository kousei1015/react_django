import React, { useState, useEffect } from "react";
import usePagination from "./usePagination";
import Auth from "../auth/Auth";
import Navbar from "./Navbar";
import Post from "../post/Post";
import EditProfile from "./EditProfile";
import {
  CoreTitle,
  CoreSelectMenu,
  CoreContainer,
  PaginateNav,
  PaginateButton,
} from "./CoreStyles";
import { LoadingScreen, DotWrapper, Dot } from "../../styles/LoadingStyles";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { Grid } from "@material-ui/core";

import {
  selectProfile,
  resetOpenSignIn,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "../auth/authSlice";

import {
  selectPosts,
  selectPage,
  selectIsLoadingPost,
  fetchAsyncGetPosts,
  fetchAsyncGetAccessSort,
  fetchAsyncGetCongestionSort,
  fetchPostStart,
  fetchPostEnd,
  setClickedPage,
} from "../post/postSlice";

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const myProfile = useSelector(selectProfile);
  const posts = useSelector(selectPosts);
  const postsLoading = useSelector(selectIsLoadingPost);
  const [orderType, setOrderType] = useState("");
  const page = useSelector(selectPage);

  useEffect(() => {
    const fetchLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        dispatch(fetchPostStart());
        await Promise.all([
          dispatch(fetchAsyncGetMyProf()),
          dispatch(fetchAsyncGetPosts(page)),
          dispatch(fetchAsyncGetProfs()),
        ]);
        dispatch(fetchPostEnd());
      } else {
        dispatch(fetchPostStart());
        await Promise.all([
          dispatch(fetchAsyncGetPosts(page)),
          dispatch(fetchAsyncGetProfs()),
        ]);
        dispatch(fetchPostEnd());
      }
    };
    fetchLoader();
  }, [dispatch]);

  useEffect(() => {
    let action;
    switch (orderType) {
      case "access":
        action = fetchAsyncGetAccessSort;
        break;
      case "congestion":
        action = fetchAsyncGetCongestionSort;
        break;
      default:
        action = fetchAsyncGetPosts;
        break;
    }
    dispatch(action(page));
  }, [dispatch, orderType, page]);

  const pagesArray = Array(posts.total_pages)
    .fill(0)
    .map((_, index) => index + 1);

  const handleClick = (pg: string | number) => {
    if (typeof pg === "number") {
      dispatch(setClickedPage(pg))
    } else return;
  };

  const { pagesFunc } = usePagination(pagesArray, page);
  const result = pagesFunc();

  return (
    <>
      <Auth />
      <EditProfile />
      <Navbar
        id={myProfile.id}
        nickName={myProfile.nickName}
        img={myProfile.img}
      />

      <CoreTitle>Map Collection</CoreTitle>
      {postsLoading ? (
        <LoadingScreen>
          <h1>Loading</h1>
          <DotWrapper>
            <Dot delay="0s" />
            <Dot delay=".3s" />
            <Dot delay=".5s" />
          </DotWrapper>
        </LoadingScreen>
      ) : (
        <>
          <CoreSelectMenu
            onChange={(e) => {
              const selectedOrderType: string = e.target.value;
              setOrderType(selectedOrderType);
            }}
            defaultValue=""
          >
            <option value="">新規投稿順</option>
            <option value="access">アクセスがよい順</option>
            <option value="congestion">混雑が少ない順</option>
          </CoreSelectMenu>

          <CoreContainer>
            <div>
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
            </div>
            <PaginateNav>
              {result?.map((pg) => (
                <PaginateButton
                  onClick={() => handleClick(pg)}
                  key={pg}
                  active={page === Number(pg) ? true : false}
                >
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
