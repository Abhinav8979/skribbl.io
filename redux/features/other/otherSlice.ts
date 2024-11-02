import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  // isPrivateRoom: false,
  isError: false,
  Play: false,
  PlayerOwner: false,
  isPlayerchoosingWord: false,
  playerIndex: 0,
  isPlayerTurn: false,
  showScore: false,
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

    // WILL BE CALLED WHEN PLAYER STARTS THE GAME
    SET_PLAY: (state, action) => {
      state.Play = action.payload;
    },

    // TO SEE WHO IS THE OWNER OF THE ROOM
    SET_PLAYER_OWNER: (state, action) => {
      state.PlayerOwner = action.payload;
    },

    // TO DISPLAY TO ALL PLAYERS THAT WORD IS BEEN CHOOSEN
    SET_CHOOSE_WORD: (state, action) => {
      state.isPlayerchoosingWord = action.payload;
    },

    //TO CHECK WHICH PLAYER TURN IS THERE FOR DRAWING
    SET_PLAYER_INDEX: (state, action) => {
      state.playerIndex = action.payload;
    },

    // TO CHECK IF THE PLAYER HAS DRAWING TURN OR NOT
    SET_IS_PLAYER_TURN: (state, action) => {
      state.isPlayerTurn = action.payload;
    },

    // will be used to display scoreboard to all players  when the game ends.
    SET_SHOW_SCORE: (state, action) => {
      state.showScore = action.payload;
    },
  },
});

export const {
  SET_LOADING,
  SET_ERROR,
  SET_PLAY,
  SET_PLAYER_OWNER,
  SET_CHOOSE_WORD,
  SET_PLAYER_INDEX,
  SET_IS_PLAYER_TURN,
  SET_SHOW_SCORE,
} = otherSlice.actions;

export default otherSlice.reducer;
