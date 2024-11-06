import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player, SetGameMessageAction, State } from "../../../utils/tsTypes";

const initialState = {
  messages: [],
  players: [],
  avatar: {
    face: 0,
    eye: 0,
    mouth: 0,
  },
  word: "",
  currentRound: 1,
  roomId: null,
  NumberOfPlayerGuessed: 0,
};

const gameInformationSlice = createSlice({
  name: "gameSetting",
  initialState,
  reducers: {
    SET_ROOM_ID: (state, action) => {
      state.roomId = action.payload;
    },

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
    SET_WORD: (state, action) => {
      state.word = action.payload;
    },
    SET_NEXT_ROUND: (state, action) => {
      // will evaluate the score here
      state.currentRound = action.payload;
    },
    SET_TOTAL_PLAYER_GUESS: (state, action) => {
      state.NumberOfPlayerGuessed = action.payload;
    },
    updatePlayerScore(
      state,
      action: PayloadAction<{ playerSocketId: string; score: number }>
    ) {
      const { playerSocketId, score } = action.payload;
      const player = state.players.find((p) => p.socketId === playerSocketId);
      if (player) {
        player.score = Math.ceil(player.score + score);
      }
    },
  },
});

export const {
  SET_ROOM_ID,
  SET_GAME_MESSAGE,
  SET_GAME_PLAYERS,
  SET_AVATAR,
  SET_WORD,
  SET_NEXT_ROUND,
  SET_TOTAL_PLAYER_GUESS,
  updatePlayerScore,
} = gameInformationSlice.actions;

export default gameInformationSlice.reducer;
