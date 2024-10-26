import { configureStore } from "@reduxjs/toolkit";
import gameSettingReducer from "./features/game/gameSetting";
import socketReducer from "./features/socket/socketSlice";
import otherSlice from "./features/other/otherSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      gameSetting: gameSettingReducer,
      socket: socketReducer,
      other: otherSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
