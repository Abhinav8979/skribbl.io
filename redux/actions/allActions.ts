import { AppDispatch } from "../store";
import { SET_GAME_SETTING } from "../features/game/gameSetting";
import {
  SET_CHOOSE_WORD,
  SET_ERROR,
  SET_GAME_OVER,
  SET_IS_DRAWING,
  SET_IS_PLAYER_TURN,
  SET_LOADING,
  SET_PLAY,
  SET_PLAYER_INDEX,
  SET_ROOM_OWNER,
  SET_SHOW_SCORE,
} from "../features/other/otherSlice";

import {
  SET_AVATAR,
  SET_GAME_MESSAGE,
  SET_GAME_PLAYERS,
  SET_NEXT_ROUND,
  SET_ROOM_ID,
  SET_TOTAL_PLAYER_GUESS,
  SET_WORD,
} from "../features/game/game";

interface PlayerSetting {
  Players: number;
  Drawtime: number;
  rounds: number;
  wordCount: number;
  hints: number;
  Language: string;
  gameMode: string;
}

interface Message {
  text: string;
  color: string;
}

interface avatar {
  face: number;
  eye: number;
  mouth: number;
}

interface Player {
  name: string;
  socketId: string;
  avatar: [number, number, number];
  score: number;
}

export const setRoomId = (state: number) => (dispatch: AppDispatch) => {
  dispatch(SET_ROOM_ID(state));
};
export const setGameSetting =
  (gameSetting: PlayerSetting) => (dispatch: AppDispatch) => {
    dispatch(SET_GAME_SETTING(gameSetting));
  };

export const setLoading = (state: boolean) => (dispatch: AppDispatch) => {
  dispatch(SET_LOADING(state));
};

export const setError = (state: boolean) => (dispatch: AppDispatch) => {
  dispatch(SET_ERROR(state));
};

export const setGameMessage =
  (message: Message[]) => (dispatch: AppDispatch) => {
    dispatch(SET_GAME_MESSAGE(message));
  };

export const setGamePlayers =
  (playerList: Player[]) => (dispatch: AppDispatch) => {
    dispatch(SET_GAME_PLAYERS(playerList));
  };

export const setAvatar = (avatar: avatar) => (dispatch: AppDispatch) => {
  dispatch(SET_AVATAR(avatar));
};

export const setPlay = (confirm: boolean) => (dispatch: AppDispatch) => {
  dispatch(SET_PLAY(confirm));
};

export const setRoomOwner = (confirm: boolean) => (dispatch: AppDispatch) => {
  dispatch(SET_ROOM_OWNER(confirm));
};

export const setIsPlayerChoosingWord =
  (word: Boolean) => (dispatch: AppDispatch) => {
    dispatch(SET_CHOOSE_WORD(word));
  };

export const setWord = (word: string) => (dispatch: AppDispatch) => {
  dispatch(SET_WORD(word));
};

export const setPlayerIndex = (index: number) => (dispatch: AppDispatch) => {
  dispatch(SET_PLAYER_INDEX(index));
};

export const setIsPlayerTURN = (index: boolean) => (dispatch: AppDispatch) => {
  dispatch(SET_IS_PLAYER_TURN(index));
};

export const setNextRound = (index: number) => (dispatch: AppDispatch) => {
  dispatch(SET_NEXT_ROUND(index));
};

export const showScore = (score: Boolean) => (dispatch: AppDispatch) => {
  dispatch(SET_SHOW_SCORE(score));
};

export const setIsDrawing = (payload: boolean) => (dispatch: AppDispatch) => {
  dispatch(SET_IS_DRAWING(payload));
};

export const setGameOver = (payload: boolean) => (dispatch: AppDispatch) => {
  dispatch(SET_GAME_OVER(payload));
};

export const setTotalPlayerGuessed =
  (payload: number) => (dispatch: AppDispatch) => {
    dispatch(SET_TOTAL_PLAYER_GUESS(payload));
  };
