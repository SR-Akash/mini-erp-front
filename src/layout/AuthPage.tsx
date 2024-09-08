import { Dispatch } from "@reduxjs/toolkit";
import useAxios from "common/hooks/useAxios";
import { getCookie } from "common/utils/_cookie";
import { _Ad_xcvbn_df_458_dfg_568_dfghfff_ioo_er_ } from "common/utils/en/sc";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRoutes } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import Login from "./Login";
import { loginAction } from "./utils";

const AuthPage = () => {
  const targetUrl = "https://arlcrm.ibos.io/";
  const currentUrl = window.location.href;
  const containsTargetUrl = currentUrl.includes(targetUrl);

  const { postData, loading } = useAxios();
  const dispatch: Dispatch<any> = useDispatch();

  const mainRoutes = useRoutes([
    {
      path: "/",
      element: containsTargetUrl ? <LoginPage /> : <Login />
    },
    { path: "*", element: containsTargetUrl ? <LoginPage /> : <Login /> }
  ]);

  useEffect(() => {
    try {
      let mgmU = getCookie("mgmU");
      let mgmP = getCookie("mgmP");

      let userName = mgmU ? _Ad_xcvbn_df_458_dfg_568_dfghfff_ioo_er_(mgmU) : "";
      let password = mgmP ? _Ad_xcvbn_df_458_dfg_568_dfghfff_ioo_er_(mgmP) : "";

      if (userName && password) {
        loginAction(postData, userName, password, dispatch);
      }
    } catch (error) {}
  }, []);

  return <div>{mainRoutes}</div>;
};

export default AuthPage;
