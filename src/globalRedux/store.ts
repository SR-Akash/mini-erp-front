import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createTransform from "redux-persist/es/createTransform";
import CryptoJS from "crypto-js";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./rootReducer";

const encrypt = createTransform(
  (inboundState: string, key) => {
    if (!inboundState) return inboundState;
    const cryptedText = CryptoJS.AES.encrypt(JSON.stringify(inboundState), "secret key 123").toString();
    return cryptedText;
  },
  (outboundState: string, key) => {
    if (!outboundState) return outboundState;
    const bytes = CryptoJS.AES.decrypt(outboundState, "secret key 123");
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }
);

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["localStorage"],
  transforms: [encrypt],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [
  ...getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
    thunk: true,
  }),
];

const store = configureStore({
  reducer: persistedReducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
