import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Dispatch } from "@reduxjs/toolkit";
import { Collapse, Form, Input, Spin } from "antd";
import useAxios from "common/hooks/useAxios";
import { useAppSelector } from "globalRedux/hooks";
import { setDataAction } from "globalRedux/localStorage/actions";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import loginLogo from "../assets/images/login-logo.svg";
import "./css/auth.css";
import { loginAction } from "./utils";
import { getCookie, setCookie } from "common/utils/_cookie";
import { _Ad_xcvbn_df_458_dfg_568_dfghfff_ioo_er_ } from "common/utils/en/sc";
import LoginWithGoogleComp from "./auth/LoginWithGoogleComp";
const { Panel } = Collapse;

const initialValues = {
  emailOrPhone: "",
  password: ""
};

const Login = ({ isTokenExpired }: { isTokenExpired?: boolean }) => {
  const { mobileNumber } = useAppSelector(
    (state) => state?.localStorage?.auth?.profileData || {}
  );

  const [values, setValues] = useState(initialValues);
  const [type, setType] = useState("password");
  const dispatch: Dispatch<any> = useDispatch();
  const { postData, loading } = useAxios();

  const handleInput = (name: string, value: string | number) => {
    setValues({ ...values, [name]: value });
  };

  const onFinish = () => {
    const userName = isTokenExpired ? mobileNumber : values?.emailOrPhone;
    loginAction(postData, userName, values?.password, dispatch);
  };

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

  return (
    <Form initialValues={initialValues} onFinish={onFinish}>
      <div
        style={
          isTokenExpired
            ? { display: "flex", alignItems: "center", height: "100%" }
            : {}
        }
        className="login"
      >
        {!isTokenExpired && (
          <div className="login-header">
            <img src={loginLogo} alt="logo" />
            <span
              style={{
                paddingLeft: "5px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "500"
              }}
            >
              LITE
            </span>
          </div>
        )}
        <div
          style={isTokenExpired ? { marginTop: "0" } : {}}
          className="login-card"
        >
          {!isTokenExpired && <p className="login-title">Log In</p>}
          <p
            style={isTokenExpired ? { paddingBottom: "5px" } : {}}
            className="login-subtitle"
          >
            {isTokenExpired ? (
              <span>
                Your session has expired. <br /> Please confirm password to
                continue
              </span>
            ) : (
              <span>Simplify your business journey with Managerium Lite</span>
            )}
          </p>
          {!isTokenExpired && (
            <>
              <p className="login-input-label">Email or phone</p>
              <Form.Item
                name="emailOrPhone"
                rules={[
                  { required: true, message: "Email or phone is required" }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  onChange={(e) => {
                    handleInput("emailOrPhone", e.target.value);
                  }}
                  className="input"
                  value={values?.emailOrPhone}
                  placeholder="Email or phone"
                />
              </Form.Item>
            </>
          )}

          <p className="login-input-label password">Password</p>
          <div className="login-password">
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input
                onChange={(e) => {
                  handleInput("password", e.target.value);
                }}
                className="input"
                type={type}
                value={values?.password}
                placeholder="Password"
                prefix={<LockOutlined />}
                suffix={
                  type === "password" ? (
                    <EyeInvisibleOutlined
                      onClick={(e) => {
                        setType(type === "password" ? "text" : "password");
                      }}
                    />
                  ) : (
                    <EyeOutlined
                      onClick={(e) => {
                        setType(type === "password" ? "text" : "password");
                      }}
                    />
                  )
                }
              />
            </Form.Item>
          </div>
          <div className="d-flex">
            <button disabled={loading} className="login-button" type="submit">
              {loading && <Spin size="small" />}{" "}
              <span style={{ marginLeft: "5px" }}>
                {isTokenExpired ? "Confirm" : "Log In"}{" "}
              </span>
            </button>
            {isTokenExpired && (
              <button
                style={{ marginLeft: "5px" }}
                disabled={loading}
                className="login-button"
                type="button"
                onClick={() => {
                  setCookie("mgmU", "", 0);
                  setCookie("mgmP", "", 0);
                  dispatch(setDataAction("auth", "isAuth", false));
                }}
              >
                <span>Logout</span>
              </button>
            )}
          </div>
          <div style={{ width: "100%" }}>{/* <LoginWithGoogleComp /> */}</div>
        </div>
      </div>
    </Form>
  );
};

export default Login;
