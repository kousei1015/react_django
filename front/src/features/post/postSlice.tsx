import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    openNewPost: false,
    page: 1,
    orderType: "",
  },
  reducers: {
    setOpenNewPost(state) {
      state.openNewPost = true;
    },
    resetOpenNewPost(state) {
      state.openNewPost = false;
    },
    setClickedPage(state, action) {
      state.page = action.payload
    },
    setOrderType(state, action){
      state.orderType = action.payload;
    }
  },
});

export const {
  setOpenNewPost,
  resetOpenNewPost,
  setClickedPage,
  setOrderType,
} = postSlice.actions;

export const selectOpenNewPost = (state: RootState) => state.post.openNewPost;
export const selectPage = (state: RootState) => state.post.page;
export const selectOrderType = (state: RootState) => state.post.orderType;

export default postSlice.reducer;
