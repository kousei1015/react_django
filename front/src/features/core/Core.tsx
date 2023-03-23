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
import { useNavigate } from "react-router";
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
  fetchAsyncGetPosts,
  fetchAsyncGetAccessSort,
  fetchAsyncGetCongestionSort,
} from "../post/postSlice";

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const myProfile = useSelector(selectProfile);
  const posts = useSelector(selectPosts);
  const [orderType, setOrderType] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        const getPosts = dispatch(fetchAsyncGetPosts());
        const getProfs = dispatch(fetchAsyncGetProfs());
        await Promise.all([result, getPosts, getProfs]);
      } else {
        await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchAsyncGetProfs());
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
      return setPage(pg);
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

      {
        <>
          <CoreTitle>Map Collection</CoreTitle>
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
      }
    </>
  );
};

export default Core;
