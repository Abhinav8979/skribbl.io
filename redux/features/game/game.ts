import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  players: [],
  avatar: {
    face: 0,
    eye: 0,
    mouth: 0,
  },
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
    SET_AVATAR: (state, action) => {
      const { face, eye, mouth } = action.payload;
      state.avatar = { face, eye, mouth };
    },
  },
});

export const { SET_GAME_MESSAGE, SET_GAME_PLAYERS, SET_AVATAR } =
  gameInformationSlice.actions;

export default gameInformationSlice.reducer;
