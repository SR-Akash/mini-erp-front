import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InitialState } from "../type";

const initState: InitialState = {
  appName: "React Dashboard",
  testInitData: {
    test: "Hello World",
  },
};

type SetDataActionType<T> = PayloadAction<
  { name: string; key: string; value: T },
  string
>;

export const localStorageSlice = createSlice({
  name: "localStorage",
  initialState: initState,
  reducers: {
    clearStorage: (state, action) => {
      Object.assign(state, initState);
    },
    setData: <T>(state: InitialState, action: SetDataActionType<T>) => {
      const payload = action.payload;
      let obj = state[payload?.name as keyof InitialState];
      state[payload?.name as keyof InitialState] = {
        ...obj,
        [payload?.key]: payload?.value,
      };
    },
  },
});
