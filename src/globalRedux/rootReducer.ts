import { combineReducers } from "redux";
import { localStorageSlice } from "./localStorage/slice";

export const rootReducer = combineReducers({
  localStorage: localStorageSlice.reducer,
});
