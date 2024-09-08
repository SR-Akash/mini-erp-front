import React from "react";
import TopAuthNaviation from "./TopAuthNaviation";
import LoginWithGoogle from "./LoginWithGoogle";
import HPoweredBy from "./PoweredBy";

const LoginPage = () => {
  return (
    <>
      <TopAuthNaviation />

      <LoginWithGoogle />

      <HPoweredBy />
    </>
  );
};

export default LoginPage;
