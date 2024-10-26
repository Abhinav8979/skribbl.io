import { createSlice } from "@reduxjs/toolkit";
import {  Socket } from "socket.io-client";

interface SocketState {
  socket: Socket | null;
}

const initialState: SocketState = {
  socket: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    SET_SOCKET: (state, action) => {
      state.socket = action.payload;
    },
    clearSocket: (state) => {
      state.socket = null;
    },
  },
});

export const { SET_SOCKET, clearSocket } = socketSlice.actions;

export default socketSlice.reducer;
