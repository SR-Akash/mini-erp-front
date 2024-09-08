import axios from "axios";
import { useAppSelector } from "globalRedux/hooks";
import { setDataAction } from "globalRedux/localStorage/actions";
import store, { persistor } from "globalRedux/store";
import React from "react";
import { createRoot } from "react-dom/client";
import "react-quill/dist/quill.snow.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import "./assets/css/index.css";
import BasePage from "./layout/BasePage";
import AuthPage from "layout/AuthPage";

const origin = window.location.origin;

export const baseURL =
  process.env.NODE_ENV === "development" ? "https://localhost:44337" : origin;
axios.defaults.baseURL = baseURL;

axios.interceptors.request.use(
  async function (config) {
    let newConfig = {
      ...config,
      headers: { ...config.headers, "Content-Type": "application/json" }
    };

    return newConfig;
  },
  function (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("Request Error", error);
    }
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  async function (response) {
    // Allow some URLs without modification
    // No decryption of response data
    return response;
  },
  async function (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("Response Error", error?.config);
    }
    if (error?.config?.url?.includes("promotion")) {
      let newError = { response: { data: error?.response?.data } };
      return Promise.reject(newError);
    }

    // Handle the error without decryption
    return Promise.reject(error);
  }
);

const App = () => {
  const { isAuth } = useAppSelector((state) => state?.localStorage?.auth || {});
  return (
    <>
      <ToastContainer
        position="bottom-right"
        newestOnTop={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={1}
        autoClose={1500}
      />
      {isAuth ? <BasePage /> : <AuthPage />}
      {/* <BasePage /> */}
    </>
  );
};
const appElement = document.getElementById("app")!;

createRoot(appElement).render(
  <Provider store={store}>
    <PersistGate loading={null as any} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
