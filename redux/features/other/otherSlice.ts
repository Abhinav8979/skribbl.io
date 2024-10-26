import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isPrivateRoom: false,
  isError: false,
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
  },
});

export const { SET_LOADING, SET_ERROR } = otherSlice.actions;

export default otherSlice.reducer;
