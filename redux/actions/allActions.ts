import { AppDispatch } from "../store";
import { SET_SOCKET } from "../features/socket/socketSlice";
import { Socket } from "socket.io-client";
import { SET_GAME_SETTING } from "../features/game/gameSetting";
import { SET_ERROR, SET_LOADING } from "../features/other/otherSlice";

interface PlayerSetting {
  Players: number;
  Drawtime: number;
  rounds: number;
  wordCount: number;
  hints: number;
  Language: string;
  gameMode: string;
}

export const setGameSetting =
  (gameSetting: PlayerSetting) => (dispatch: AppDispatch) => {
    dispatch(SET_GAME_SETTING(gameSetting));
  };

export const setSocket = (socket: Socket) => (dispatch: AppDispatch) => {
  dispatch(SET_SOCKET(socket));
};

export const setLoading = (state: boolean) => (dispatch: AppDispatch) => {
  dispatch(SET_LOADING(state));
};

export const setError = (state: boolean) => (dispatch: AppDispatch) => {
  dispatch(SET_ERROR(state));
};
