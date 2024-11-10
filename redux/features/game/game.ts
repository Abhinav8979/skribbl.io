import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player, State } from "../../../utils/tsTypes";

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

    SET_GAME_MESSAGE: (state: State, action) => {
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
    updatePlayerScore(state, action) {
      const { playerSocketId, score } = action.payload;
      const player = state.players.find(
        (p) => (p as Player).socketId === playerSocketId
      );

      if (player) {
        (player as Player).score = Math.ceil(score);
      }
    },
    resetPlayerScore(state) {
      state.players.forEach((player) => {
        (player as Player).score = 0;
      });
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
  resetPlayerScore,
} = gameInformationSlice.actions;

export default gameInformationSlice.reducer;
