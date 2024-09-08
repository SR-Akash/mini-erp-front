// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { Dispatch } from "@reduxjs/toolkit";
// import useAxios from "common/hooks/useAxios";
// import { loginActionWithGoogle } from "layout/utils";
// import React from "react";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// const LoginWithGoogleComp = () => {
//   const { postData, loading } = useAxios();
//   const dispatch: Dispatch<any> = useDispatch();

//   return (
//     <div style={{ width: "100%", textAlign: "center" }}>
//       <GoogleOAuthProvider clientId="228334914650-rc3re7ihe1pii4vgscif5bgkjlf96an6.apps.googleusercontent.com">
//         <GoogleLogin
//           onSuccess={(res) => {
//             console.log(res, "res");
//             loginActionWithGoogle(postData, res?.credential, dispatch);
//           }}
//           onError={() => {
//             toast.error("Login Failed");
//           }}
//           text="signin_with"
//           logo_alignment="center"
//         />
//       </GoogleOAuthProvider>
//     </div>
//   );
// };
// export default LoginWithGoogleComp;

import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { Dispatch } from "@reduxjs/toolkit";
import useAxios from "common/hooks/useAxios";
import React from "react";
import { useDispatch } from "react-redux";
import googleIcon from "../../assets/images/google.png";
import GoogleLoginButton from "./GoogleLoginButton";
import { loginActionWithGoogle } from "layout/utils";

const GoogleLoginWrapper = () => (
  <GoogleOAuthProvider clientId="228334914650-rc3re7ihe1pii4vgscif5bgkjlf96an6.apps.googleusercontent.com">
    <LoginWithGoogleComp />
  </GoogleOAuthProvider>
);

const LoginWithGoogleComp = () => {
  const { postData, loading } = useAxios();
  const dispatch: Dispatch<any> = useDispatch();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse: any) => {
      console.log("Login Success:", codeResponse);
      const { access_token } = codeResponse;
      // // Exchange access_token for user info or directly use it to authenticate with your backend
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );

      const userInfo = await response.json();
      console.log("User Info:", userInfo);
      loginActionWithGoogle(
        postData,
        userInfo?.email,
        userInfo?.name,
        dispatch
      );
    },
    onError: (error) => console.log("Login Failed:", error)
  });

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "10px",
        backgroundColor: "#fff",
        width: "370px"
      }}
    >
      <GoogleLoginButton
        title="Sign in with Google"
        onClick={(e: any) => {
          e.preventDefault();
          login();
        }}
        isIcon={true}
        iconSrc={googleIcon}
        isFullwidth={true}
      />
    </div>
  );
};

export default GoogleLoginWrapper;
