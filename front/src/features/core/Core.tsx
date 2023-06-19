import React, { useEffect, useMemo, useRef } from "react";
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
  selectOrderType,
  fetchAsyncGetPosts,
  fetchAsyncGetAccessSort,
  fetchAsyncGetCongestionSort,
  fetchPostStart,
  fetchPostEnd,
  setClickedPage,
  setOrderType,
} from "../post/postSlice";

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const myProfile = useSelector(selectProfile);
  const posts = useSelector(selectPosts);
  const postsLoading = useSelector(selectIsLoadingPost);
  const orderType = useSelector(selectOrderType);
  const page = useSelector(selectPage);
  const isMounted = useRef(false);

  useEffect(() => {
    const fetchLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        dispatch(fetchPostStart());
        await Promise.all([
          dispatch(fetchAsyncGetMyProf()),
          dispatch(fetchAsyncGetProfs()),
        ]);
        dispatch(fetchPostEnd());
      } else {
        dispatch(fetchPostStart());
        await dispatch(fetchAsyncGetProfs());
        dispatch(fetchPostEnd());
      }
    };
    fetchLoader();
  }, [dispatch]);
  
  const getPostsByOrderType = useMemo(() => {
    return () => {
      switch (orderType) {
        case "access":
          return fetchAsyncGetAccessSort;
        case "congestion":
          return fetchAsyncGetCongestionSort;
        default:
          return fetchAsyncGetPosts;
        }
      };
    }, [orderType]);
    
    useEffect(() => {
      // orderTypeが変わって、かつpageステートが1出ない時は、pageの値を1にする。
      // 次に、pageの値が変わったことで下の、pageを依存配列としているuseEffectの処理が走る。
      // バックエンドからソートされたデータを取得できる。
      if (isMounted.current && page !== 1) {
        dispatch(setClickedPage(1));
      }
      // pageが1の時、ordetTypeが変わってもpageを依存配列としているuseEffectの処理が走らない、つまりバックエンドからソートされたデータを取ってこない。
      // よってpageが1の状態で、かつorderTypeが変わった場合は下のように書いてバックエンドからデータを取ってくる。
      else if (isMounted.current && page === 1) {
        const postsData = getPostsByOrderType();
        const fetchData = dispatch(postsData(1));
        return () => {
          fetchData.abort();
        }
      }
      else {
        isMounted.current = true;
      }
    }, [dispatch, orderType]);
    
    useEffect(() => {
      const postsData = getPostsByOrderType()
      const fetchData = dispatch(postsData(page));
      return () => {
      fetchData.abort();
    };
  }, [dispatch, page]);

  const pagesArray = useMemo(() => {
    return Array(posts.total_pages)
      .fill(0)
      .map((_, index) => index + 1);
  }, [posts.total_pages]);

  const handleClick = (pg: string | number) => {
    if (typeof pg === "number") {
      dispatch(setClickedPage(pg));
    };
  };

  const { pagesFunc } = usePagination(pagesArray, page);
  const pagination = pagesFunc();

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
              dispatch(setOrderType(selectedOrderType));
            }}
            defaultValue={orderType}
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
              {pagination?.map((pg) => (
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
