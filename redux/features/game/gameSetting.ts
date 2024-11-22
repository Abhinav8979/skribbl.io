import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Players: 8,
  Drawtime: 80,
  rounds: 8,
  wordCount: 3,
  hints: 2,
  Language: "english",
  gameMode: "normal",
  customWords: [],
};

const gameSettingSlice = createSlice({
  name: "gameSetting",
  initialState,
  reducers: {
    SET_GAME_SETTING: (state, action) => {
      state.Players = action.payload?.players;
      state.Drawtime = action.payload?.Drawtime;
      state.rounds = action.payload?.rounds;
      state.wordCount = action.payload?.wordCount;
      state.hints = action.payload?.hints;
      state.Language = action.payload?.Language;

      if (action.payload.wordArray.length > 0) {
        const wordArray = action.payload?.wordArray.split(",");
        state.customWords = wordArray;
      }
    },
  },
});

export const { SET_GAME_SETTING } = gameSettingSlice.actions;

export default gameSettingSlice.reducer;
