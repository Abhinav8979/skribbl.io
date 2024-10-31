import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isPrivateRoom: false,
  isError: false,
  Play: false,
  PlayerOwner: false,
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
    SET_PLAYER_OWNER: (state, action) => {
      state.PlayerOwner = action.payload;
    },
  },
});

export const { SET_LOADING, SET_ERROR, SET_PLAY, SET_PLAYER_OWNER } =
  otherSlice.actions;

export default otherSlice.reducer;
