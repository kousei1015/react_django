import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  PROPS_NEWPOST,
  PROPS_COMMENT,
  EDIT_CONTENTS,
  CustomFormData,
} from "../types";
import * as api from "../post/api";


export const fetchAsyncGetPosts = createAsyncThunk("post/get", async () => {
  const res = await api.fetchAsyncGetPosts();
  return res.data;
});


export const fetchAsyncGetDetail = createAsyncThunk(
  "post/getDetail",
  async (id: string) => {
    const res = await api.fetchAsyncGetDetail(id);
    return res.data;
  }
);



export const fetchDeletePost = createAsyncThunk(
  "post/delete",
  async (id: string) => {
    const res = await api.fetchDeletePost(id);
    return res.data;
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

    const res = await api.fetchAsyncNewPost(uploadData);
    return res.data;
  }
);

export const fetchEditPost = createAsyncThunk(
  "post/put",
  async ({ id, EditPost }: EDIT_CONTENTS) => {
    const res = await api.fetchEditPost(id, EditPost);
    return res.data;
  }
);

export const fetchAsyncGetComments = createAsyncThunk(
  "comment/get",
  async () => {
    const res = await api.fetchAsyncGetComments();
    return res.data;
  }
);

export const fetchAsyncPostComment = createAsyncThunk(
  "comment/post",
  async (comment: PROPS_COMMENT) => {
    const res = await api.fetchAsyncPostComment(comment);
    return res.data;
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
        id: "0",
        text: "",
        userComment: 0,
        //post 0だった
        post: "0",
      },
    ],
    postDetail: {
      id: "0",
      placeName: "",
      description: "",
      userPost: 0,
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
    builder.addCase(fetchDeletePost.fulfilled, (state, action) => {
      return {
        ...state,
        posts: state.posts.filter(
          (postDetail) => postDetail.id !== action.payload
        ),
      };
    });

    builder.addCase(fetchEditPost.fulfilled, (state, action) => {
      return {
        ...state,
        posts: state.posts.map((postDetail) =>
          postDetail.id === action.payload.id ? action.payload : postDetail
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
