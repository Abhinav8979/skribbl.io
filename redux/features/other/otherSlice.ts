import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isPrivateRoom: false,
  isError: false,
  Play: false,
};

const otherSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SET_LOADING: (state, action) => {
      state.isLoading = action.payload;
    },
    SET_ERROR: (state, action) => {
      state.isError = action.payload;
    },
    SET_PLAY: (state, action) => {
      state.Play = action.payload;
    },
  },
});

export const { SET_LOADING, SET_ERROR, SET_PLAY } = otherSlice.actions;

export default otherSlice.reducer;
