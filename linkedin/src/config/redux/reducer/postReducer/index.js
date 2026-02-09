import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts } from "./postsThunk";

const initialState = {
  posts: [],
  isError: false,
  postsFetched: false,
  message: "",
  loggedIn: false,
  isLoading: false,
  comments: [],
  postId: "",
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reset: () => initialState,

    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postsFetched = true;
        state.posts = action.payload;
        state.message = "Posts fetched successfully";
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.postsFetched = false;
        state.message = action.payload || "Failed to fetch posts";
      });
  },
});

export const { reset, resetPostId } = postsSlice.actions;
export default postsSlice.reducer;
