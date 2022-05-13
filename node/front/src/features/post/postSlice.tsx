import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_NEWPOST, PROPS_COMMENT } from "../types";

import * as api from "../post/api"


const apiUrlPost = "http://localhost:8000/api/post/";
const apiUrlDetailPost = "http://localhost:8000/api/post/${id}/"
const apiUrlComment = "http://localhost:8000/api/comment/";



export const fetchAsyncGetPosts = createAsyncThunk("post/get", async () => {
  const res = await axios.get(apiUrlPost, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
    
  });
  return res.data;
});

{/*ここでdetailページ */}
export const fetchAsyncGetDetail = createAsyncThunk(
  "post/getDetail",
  async (id: number) => {
      const response = await api.fetchAsyncGetDetail(id)
      return response.data 
  }
);


export const fetchAsyncNewPost = createAsyncThunk(
  "post/post",
  async (newPost: PROPS_NEWPOST) => {
    const uploadData = new FormData();
    uploadData.append("placeName", newPost.placeName as string);
    uploadData.append("description", newPost.description as string)
    uploadData.append("access_stars", newPost.access_stars as any);
    uploadData.append("congestion_degree", newPost.congestion_degree as any);
    newPost.img && uploadData.append("img", newPost.img, newPost.img.name);
    
    const res = await axios.post(apiUrlPost, uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);



export const fetchAsyncGetComments = createAsyncThunk(
  "comment/get",
  async () => {
    const res = await axios.get(apiUrlComment, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const fetchAsyncPostComment = createAsyncThunk(
  "comment/post",
  async (comment: PROPS_COMMENT) => {
    const res = await axios.post(apiUrlComment, comment, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);


{/* posts: []はdetail用にもう一個作るべき、posts:[]はdescriptionをやっても無駄apiurlの関係上*/}
export const postSlice = createSlice({
  name: "post",
  initialState: {
    isLoadingPost: false,
    openNewPost: false,
    posts: [
      {
        id: 0,
        placeName: "",
        description: "",
        userPost: 0,
        access_stars: 0,
        congestion_degree: 0,
        img: "",
      },
    ],
    comments: [
      {
        id: 0,
        text: "",
        userComment: 0,
        post: 0,
      },
    ],
    postDetail: {
      id: 0,
      placeName: "",
      description: "",
      userPost: 0,
      access_stars: 0,
      congestion_degree: 0,
      img: "",
    },
  },
  reducers: {
    fetchPostStart(state) {
      state.isLoadingPost = true;
    },
    fetchPostEnd(state) {
      state.isLoadingPost = false;
    },
    setOpenNewPost(state) {
      state.openNewPost = true;
    },
    resetOpenNewPost(state) {
      state.openNewPost = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetPosts.fulfilled, (state, action) => {
      return {
        ...state,
        posts: action.payload,
      };
    });
    {/*ここでDetailPage  */}
    builder.addCase(fetchAsyncGetDetail.fulfilled, (state, action) => {
      return {
        ...state,
        postDetail: action.payload,
      };
    });
    
    builder.addCase(fetchAsyncNewPost.fulfilled, (state, action) => {
      return {
        ...state,
        posts: action.payload,
      };
    });
    builder.addCase(fetchAsyncGetComments.fulfilled, (state, action) => {
      return {
        ...state,
        comments: action.payload,
      };
    });
    builder.addCase(fetchAsyncPostComment.fulfilled, (state, action) => {
      return {
        ...state,
        comments: [...state.comments, action.payload],
      };
    });
   
  },
});

export const {
  fetchPostStart,
  fetchPostEnd,
  setOpenNewPost,
  resetOpenNewPost,
} = postSlice.actions;

export const selectIsLoadingPost = (state: RootState) =>
  state.post.isLoadingPost;
export const selectOpenNewPost = (state: RootState) => state.post.openNewPost;
export const selectPostDetail = (state: RootState) => state.post.postDetail;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectComments = (state: RootState) => state.post.comments;

export default postSlice.reducer;