import React, { useState, useEffect } from "react";
import Auth from "../auth/Auth";
import ReactPaginate from "react-paginate";
import {
  CoreHeader,
  CoreTitle,
  CoreButton,
  CoreLogout,
  CorePosts,
  StyledPaginateContainer,
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

import Post from "../post/Post";
import EditProfile from "./EditProfile";

const Core = () => {
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const posts = useSelector(selectPosts);
  const isLoadingPost = useSelector(selectIsLoadingPost);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const [pageNumber, setPageNumber] = useState(0);
  const postsPerPage = 12;
  const pagesVisited = pageNumber * postsPerPage;
  const pageCount = Math.ceil(posts.length / postsPerPage);
  const changePage = ({ selected }: { selected: number }) => {
    setPageNumber(selected);
  };
  const navigate = useNavigate();
  function pushHome() {
    navigate("/post/create");
  }

  useEffect(() => {
    const fetchLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
        await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchAsyncGetProfs());
      }
    };
    fetchLoader();
  }, [dispatch]);

  return (
    <div>
      <Auth />
      <EditProfile />

      <CoreHeader>
        <CoreTitle>Map Collection</CoreTitle>
        {profile?.nickName ? (
          <>
            <CoreButton
              onClick={() => {
                dispatch(resetOpenProfile());
                pushHome();
              }}
            >
              新規投稿
            </CoreButton>
            <CoreLogout>
              {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
              <Button
                onClick={() => {
                  localStorage.removeItem("localJWT");
                  dispatch(editNickname(""));
                  dispatch(resetOpenProfile());
                  dispatch(resetOpenNewPost());
                  dispatch(setOpenSignIn());
                }}
              >
                Logout
              </Button>
              <CoreButton
                onClick={() => {
                  dispatch(setOpenProfile());
                  dispatch(resetOpenNewPost());
                }}
              >
                <Avatar alt="who?" src={profile.img} />{" "}
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

      {profile?.nickName && (
        <>
          <CorePosts>
            <Grid container spacing={4}>
              {posts
                .slice(pagesVisited, pagesVisited + postsPerPage)
                .map((post) => (
                  <Grid key={post.id} item xs={12} md={4}>
                    <Post
                      postId={post.id}
                      placeName={post.placeName}
                      description={post.description}
                      loginId={profile.userProfile}
                      userPost={post.userPost}
                      imageUrl={post.img}
                      accessStars={post.accessStars}
                      congestionDegree={post.congestionDegree}
                    />
                  </Grid>
                ))}
            </Grid>
            <StyledPaginateContainer>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              />
            </StyledPaginateContainer>
          </CorePosts>
        </>
      )}
    </div>
  );
};

export default Core;
