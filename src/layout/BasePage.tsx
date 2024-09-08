import React, { useEffect } from "react";
import Main from "./Main";
import Sidemenu from "./Sidemenu";
import axios from "axios";
import { useAppSelector } from "globalRedux/hooks";
import TokenExpired from "common/components/tokenExpired/TokenExpired";
import { getCookie, setCookie } from "common/utils/_cookie";
import { setDataAction } from "globalRedux/localStorage/actions";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const BasePage = () => {

  const dispatch: Dispatch<any> = useDispatch();

  const { token } = useAppSelector((state) => state?.localStorage?.auth?.profileData || {});
  const { isExpiredToken } = useAppSelector((state) => state?.localStorage?.auth || {});

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    try {
    let mgmU = getCookie("mgmU");
    
    if(!mgmU)
    {
      setCookie("mgmU", "" , 0);
      setCookie("mgmP", "" , 0);
      dispatch(setDataAction("auth", "isAuth", false));
    }
    } catch (error) {
        
    }
},[])

  return (
    <div className="app-v2">
      <Sidemenu />
      <Main />
      {isExpiredToken && <TokenExpired />}
    </div>
  );
};

export default BasePage;
