import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  players: [],
};
interface Message {
  text: string;
  color: string;
}
interface State {
  messages: Message[];
}

interface SetGameMessageAction {
  type: string;
  payload: Message[];
}

const gameInformationSlice = createSlice({
  name: "gameSetting",
  initialState,
  reducers: {
    SET_GAME_MESSAGE: (state: State, action: SetGameMessageAction) => {
      state.messages = [...action.payload];
    },
    SET_GAME_PLAYERS: (state, action) => {
      state.players = action.payload;
    },
  },
});

export const { SET_GAME_MESSAGE, SET_GAME_PLAYERS } =
  gameInformationSlice.actions;

export default gameInformationSlice.reducer;
