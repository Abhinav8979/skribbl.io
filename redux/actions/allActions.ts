import { AppDispatch } from "../store";
import { SET_GAME_SETTING } from "../features/game/gameSetting";
import { SET_ERROR, SET_LOADING } from "../features/other/otherSlice";
import { SET_GAME_MESSAGE, SET_GAME_PLAYERS } from "../features/game/game";

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
  (playerList: string[]) => (dispatch: AppDispatch) => {
    dispatch(SET_GAME_PLAYERS(playerList));
  };
