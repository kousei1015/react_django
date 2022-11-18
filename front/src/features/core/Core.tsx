import React, { useState, useEffect } from "react";
import Auth from "../auth/Auth";
import Post from "../post/Post";
import EditProfile from "./EditProfile";
import ReactPaginate from "react-paginate";
import {
  CoreHeader,
  CoreTitle,
  CoreButton,
  CoreSelectMenu,
  CoreLogout,
  CoreContainer,
  CoreStyledPagination,
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
  
  //アクセスがよい順にソート
  const accessAsc = [...posts].sort( (a, b) => a.accessStars < b.accessStars ? 1: -1 )
  //混雑が少ない場所順にソート
  const congestionAsc = [...posts].sort( (a, b) => a.congestionDegree < b.congestionDegree ? 1: -1 )

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
  }, [dispatch, orderType]);

  return (
    <>
      <Auth />
      <EditProfile />
      <CoreHeader>
        <CoreTitle>Map Collection</CoreTitle>
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
                const selectedOrderType:string = e.target.value;
                setOrderType(selectedOrderType);
              }}
            >
              <option value="" selected>新規投稿順</option>
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
          <CoreContainer>
          {orderType === "" && (
              <Grid container spacing={4}>
                {posts
                  .slice(pagesVisited, pagesVisited + postsPerPage)
                  .map((post) => (
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
                      />
                    </Grid>
                  ))}
              </Grid>
            )}
            {orderType === "access" && (
              <Grid container spacing={4}>
                {accessAsc
                  .slice(pagesVisited, pagesVisited + postsPerPage)
                  .map((post) => (
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
                      />
                    </Grid>
                  ))}
              </Grid>
            )}
            {orderType === "congestion" && (
              <Grid container spacing={4}>
                {congestionAsc
                  .slice(pagesVisited, pagesVisited + postsPerPage)
                  .map((post) => (
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
                      />
                    </Grid>
                  ))}
              </Grid>
            )}

            <CoreStyledPagination>
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
            </CoreStyledPagination>
          </CoreContainer>
        </>
      )}
    </>
  );
};

export default Core;
