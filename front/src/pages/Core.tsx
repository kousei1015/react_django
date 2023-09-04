import React, { useMemo } from "react";
import usePagination from "../hooks/usePagination";
import Auth from "./Auth";
import Navbar from "../components/Navbar/Navbar";
import Post from "../components/Post/Post";
import EditProfile from "../components/EditProfile/EditProfile";
import {
  Grid,
  GridChild,
  CoreTitle,
  CoreSelectMenu,
  CoreContainer,
  PaginateNav,
  PaginateButton,
} from "./CoreStyles";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../redux/app/store";
import {
  selectPage,
  selectOrderType,
  setClickedPage,
  setOrderType,
} from "../redux/slices/post/postSlice";
import { usePosts, useMyProfile, useProfiles } from "../hooks/useQueryHooks";
import Loading from "../components/Loading/Loading";

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const orderType = useSelector(selectOrderType);
  const page = useSelector(selectPage);

  const { data: profiles } = useProfiles();
  const { data: myProfile } = useMyProfile();
  const { data: posts } = usePosts(page, orderType);

  const pagesArray = useMemo(() => {
    return Array(posts?.total_pages)
      .fill(0)
      .map((_, index) => index + 1);
  }, [posts?.total_pages]);

  const handleClick = (pg: string | number) => {
    if (typeof pg === "number") {
      dispatch(setClickedPage(pg));
    }
  };

  const { pagesFunc } = usePagination(pagesArray, page);
  const pagination = pagesFunc();

  return (
    <>
      <Auth />
      <EditProfile
        id={myProfile?.id}
        nickName={myProfile?.nickName}
        img={myProfile?.img}
      />
      <Navbar
        id={myProfile?.id}
        nickName={myProfile?.nickName}
        img={myProfile?.img}
      />

      <CoreTitle>Map Collection</CoreTitle>

      <>
        <CoreSelectMenu
          onChange={(e) => {
            const selectedOrderType = e.target.value;
            dispatch(setOrderType(selectedOrderType));
          }}
          defaultValue={orderType}
        >
          <option value="">新規投稿順</option>
          <option value="access">アクセスがよい順</option>
          <option value="congestion">混雑が少ない順</option>
        </CoreSelectMenu>

        {posts && profiles ? (
          <CoreContainer>
            <Grid>
              {posts?.results.map((post) => (
                <GridChild key={post.id}>
                  <Post
                    id={post.id}
                    placeName={post.placeName}
                    description={post.description}
                    userPost={post.userPost}
                    img={post.img}
                    accessStars={post.accessStars}
                    congestionDegree={post.congestionDegree}
                    tags={post.tags}
                    profiles={profiles}
                  />
                </GridChild>
              ))}
            </Grid>

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
        ) : (
          <Loading />
        )}
      </>
    </>
  );
};

export default Core;
