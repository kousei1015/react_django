import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {
  PROPS_NEWPOST,
  PROPS_COMMENT,
  CustomFormData,
  DETAIL_CONTENT,
  
} from "../types";





export const fetchAsyncGetPosts = createAsyncThunk("post/get", async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}api/post/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});


export const fetchAsyncGetDetail = createAsyncThunk(
  "post/getDetail",
  async (id: string) => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}api/post/${id}`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);


export const fetchAsyncDelete = createAsyncThunk(
  "post/delete",
  async (id: string) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}api/post/${id}`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return id;
  }
);


export const fetchAsyncNewPost = createAsyncThunk(
  "post/post",
  async (newPost: PROPS_NEWPOST) => {
    const uploadData = new FormData() as CustomFormData;
    uploadData.append("placeName", newPost.placeName as string);
    uploadData.append("description", newPost.description as string);
    uploadData.append("accessStars", newPost.accessStars as number);
    uploadData.append("congestionDegree", newPost.congestionDegree as number);
    newPost.img && uploadData.append("img", newPost.img, newPost.img.name);

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}api/post/`,
      uploadData,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);


export const fetchAsyncEditPost = createAsyncThunk(
  "post/patch",
  async (postDetail: DETAIL_CONTENT) => {
    const postUploadData = new FormData() as CustomFormData;
    postUploadData.append("placeName", postDetail.placeName as string);
    postUploadData.append("description", postDetail.description as string);
    postUploadData.append("accessStars", postDetail.accessStars as number);
    postUploadData.append(
      "congestionDegree",
      postDetail.congestionDegree as number
    );
    postDetail.img &&
      postUploadData.append("img", postDetail.img, postDetail.img.name);
    const res = await axios.patch(
      `${process.env.REACT_APP_API_URL}api/post/${postDetail.id}`,
      postUploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetComments = createAsyncThunk(
  "comment/get",
  async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}api/comment/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);


export const fetchAsyncPostComment = createAsyncThunk(
  "comment/post",
  async (comment: PROPS_COMMENT) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}api/comment/`,
      comment,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState: {
    isLoadingPost: false,
    openNewPost: false,
    posts: [
      {
        id: "0",
        placeName: "",
        description: "",
        userPost: 0,
        accessStars: 0,
        congestionDegree: 0,
        img: "",
      },
    ],
    comments: [
      {
        id: 0,
        text: "",
        userComment: 0,
        post: "0",
      },
    ],
    postDetail: {
      id: "0",
      placeName: "",
      description: "",
      userPost: {
        id: 0,
        profile: {
          userProfile: 0,
          nickName: "",
          img: "",
        },
      },
      accessStars: 0,
      congestionDegree: 0,
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
    {
      /*ここでDetailPage  */
    }
    builder.addCase(fetchAsyncGetDetail.fulfilled, (state, action) => {
      return {
        ...state,
        postDetail: action.payload,
      };
    });
    {
      /*ここでDeletefunc  */
    }
    builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
      return {
        ...state,
        posts: state.posts.filter(
          (p) => p.id !== action.payload
        ),
      };
    });

    builder.addCase(fetchAsyncEditPost.fulfilled, (state, action) => {
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    });

    builder.addCase(fetchAsyncNewPost.fulfilled, (state, action) => {
      return {
        ...state,
        posts: [...state.posts, action.payload],
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
