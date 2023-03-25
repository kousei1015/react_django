import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {
  PROPS_NEWPOST,
  PROPS_COMMENT,
  CustomFormData,
  DETAIL_CONTENT,
} from "../types";

const apiUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : process.env.REACT_APP_API_DEV_URL;

export const fetchAsyncGetPosts = createAsyncThunk(
  "post/get",
  async (params: number = 1) => {
    const res = await axios.get(
      `${apiUrl}api/post/?page=${params}`
    );
    return res.data;
  }
);

export const fetchAsyncGetAccessSort = createAsyncThunk(
  "post/access/sort",
  async (params: number = 1) => {
    const res = await axios.get(
      `${apiUrl}api/post/access/?page=${params}`
    );
    return res.data;
  }
);

export const fetchAsyncGetCongestionSort = createAsyncThunk(
  "post/congestion/get",
  async (params: number = 1) => {
    const res = await axios.get(
      `${apiUrl}api/post/congestion/?page=${params}`
    );
    return res.data;
  }
);


export const fetchAsyncGetDetail = createAsyncThunk(
  "post/getDetail",
  async (id: number) => {
    const res = await axios.get(
      `${apiUrl}api/post/${id}`
    );
    return res.data;
  }
);

export const fetchAsyncDelete = createAsyncThunk(
  "post/delete",
  async (id: number) => {
    try {
      await axios.delete(`${apiUrl}api/post/${id}`, {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        localStorage.removeItem("localJWT");
      }
      throw error;
    }
  }
);

export const fetchAsyncNewPost = createAsyncThunk(
  "post/post",
  async (newPost: PROPS_NEWPOST) => {
    try {
      const uploadData = new FormData() as CustomFormData;
      uploadData.append("placeName", newPost.placeName as string);
      uploadData.append("description", newPost.description as string);
      uploadData.append("accessStars", newPost.accessStars as number);
      uploadData.append("congestionDegree", newPost.congestionDegree as number);
      //if (newPost.tags[0].name !== "" ) {

      for (var i = 0; i < newPost.tags.length; i++) {
        uploadData.append(`tags[${i}]name`, newPost.tags[i].name as string);
      }

      newPost.img && uploadData.append("img", newPost.img, newPost.img.name);

      const res = await axios.post(
        `${apiUrl}api/post/`,
        uploadData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        localStorage.removeItem("localJWT");
      }
      throw error;
    }
  }
);

export const fetchAsyncEditPost = createAsyncThunk(
  "post/patch",
  async (postDetail: DETAIL_CONTENT) => {
    try {
      const postUploadData = new FormData() as CustomFormData;
      postUploadData.append("placeName", postDetail.placeName);
      postUploadData.append("description", postDetail.description);
      postUploadData.append("accessStars", postDetail.accessStars);
      postUploadData.append(
        "congestionDegree",
        postDetail.congestionDegree as number
      );
      for (var i = 0; i < postDetail.tags.length; i++) {
        postUploadData.append(`tags[${i}]name`, postDetail.tags[i].name);
      }
      postDetail.img &&
        postUploadData.append("img", postDetail.img, postDetail.img.name);

      const res = await axios.put(
        `${apiUrl}api/post/${postDetail.id}`,
        postUploadData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        localStorage.removeItem("localJWT");
      }
      throw error;
    }
  }
);

export const fetchAsyncGetComments = createAsyncThunk(
  "comment/get",
  async () => {
    const res = await axios.get(
      `${apiUrl}api/comment/`,
    );
    return res.data;
  }
);

export const fetchAsyncPostComment = createAsyncThunk(
  "comment/post",
  async (comment: PROPS_COMMENT) => {
    try {
      const res = await axios.post(
        `${apiUrl}api/comment/`,
        comment,
        {
          headers: {
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        localStorage.removeItem("localJWT");
      }
      throw error;
    }
  }
);

export const fetchAsyncDeleteComment = createAsyncThunk(
  "comment/delete",
  async (id: number) => {
    try {
      await axios.delete(`${apiUrl}api/comment/${id}/`, {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return id;
    }
    catch(error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        localStorage.removeItem("localJWT");
      }
      throw error;
    }
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState: {
    isLoadingPost: false,
    openNewPost: false,
    posts: {
      total_pages: 0,
      results: [{
        id: 0,
        placeName: "",
        description: "",
        userPost: 0,
        accessStars: 0,
        congestionDegree: 0,
        img: "",
        tags: [
          {
            id: 0,
            name: "",
          },
        ],
      },
    ]
  },
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
      accessStars: 0,
      congestionDegree: 0,
      tags: [
        {
          name: "",
        },
      ],
      userPost: {
        id: 0,
        profile: {
          userProfile: 0,
          nickName: "",
          img: "",
        },
      },
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
    //投稿一覧取
    builder.addCase(fetchAsyncGetPosts.fulfilled, (state, action) => {
      return {
        ...state,
        posts: action.payload,
      };
    });

    //アクセス順にソート
    builder.addCase(fetchAsyncGetAccessSort.fulfilled, (state, action) => {
      return {
        ...state,
        posts: action.payload,
      };
    });

    //混雑度順にソート
    builder.addCase(fetchAsyncGetCongestionSort.fulfilled, (state, action) => {
      return {
        ...state,
        posts: action.payload,
      };
    });

    //詳細ページ
    builder.addCase(fetchAsyncGetDetail.fulfilled, (state, action) => {
      return {
        ...state,
        postDetail: action.payload,
      };
    });

    //削除機能
    builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
      return {
        ...state,
        results: state.posts.results.filter((p) => p.id !== action.payload),
      };
    });

    //編集機能
    builder.addCase(fetchAsyncEditPost.fulfilled, (state, action) => {
      return {
        ...state,
        results: state.posts.results.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    });

    //投稿機能
    builder.addCase(fetchAsyncNewPost.fulfilled, (state, action) => {
      return {
        ...state,
        results: [...state.posts.results, action.payload],
      };
    });

    //コメント取得
    builder.addCase(fetchAsyncGetComments.fulfilled, (state, action) => {
      return {
        ...state,
        comments: action.payload,
      };
    });

    //コメント投稿機能
    builder.addCase(fetchAsyncPostComment.fulfilled, (state, action) => {
      return {
        ...state,
        comments: [...state.comments, action.payload],
      };
    });

    //コメント削除機能
    builder.addCase(fetchAsyncDeleteComment.fulfilled, (state, action) => {
      return {
        ...state,
        comments: state.comments.filter((comment) => comment.id !== action.meta.arg)
      }
    })
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
