import React from "react";
import styles from "./tokenExpired.module.css";
import AuthPage from "layout/Login";

const TokenExpired = () => {
  return (
    <div className={styles?.tokenExpired}>
      <AuthPage isTokenExpired />
    </div>
  );
};

export default TokenExpired;
