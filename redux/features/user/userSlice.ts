import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name:
    sessionStorage.getItem("name") === ""
      ? null
      : sessionStorage.getItem("name"),
  avatar: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SET_NAME: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { SET_NAME } = userSlice.actions;

export default userSlice.reducer;



