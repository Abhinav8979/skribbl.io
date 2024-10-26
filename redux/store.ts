import { configureStore } from "@reduxjs/toolkit";
import gameSettingReducer from "./features/game/gameSetting";
import otherSlice from "./features/other/otherSlice";
import gameReducer from "./features/game/game";

export const makeStore = () => {
  return configureStore({
    reducer: {
      gameSetting: gameSettingReducer,
      other: otherSlice,
      game: gameReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
