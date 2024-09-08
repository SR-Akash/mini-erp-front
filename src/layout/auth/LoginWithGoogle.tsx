import React, { useEffect, useState } from "react";
import LoginWithGoogleComp from "./LoginWithGoogleComp";
import loginLogo from "../../assets/images/mgm-logo.svg";
import useAxios from "common/hooks/useAxios";
import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";

const LoginWithGoogle = () => {
  const location = window.location.href;
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };
  const [value1, setValue1] = useState("Candidate");

  const plainOptions = ["Candidate", "Organization"];
  const onChange1 = ({ target: { value } }: RadioChangeEvent) => {
    setValue1(value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "40%",
            borderRadius: "8px",
            border: "1px solid rgba(0,0,0,.125)",
            color: "#4a4a4a",
            display: "block",
            padding: "1.25rem",
            backgroundColor:"#fff"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
              gap: "20px",
              backgroundColor:"#fff"
            }}
          >
            <div style={{backgroundColor:"#fff"}}>
              <Radio.Group
                options={plainOptions}
                value={value1}
                onChange={onChange1}
                style={{backgroundColor:"#fff"}}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "40px",
                margin: "auto",
                alignItems: "center"
              }}
            >
              <img
                src={loginLogo}
                alt="logo"
                style={{
                  height: "26px"
                }}
              />
              <p
                style={{
                  fontSize: "21px",
                  color: "#036369",
                  paddingLeft: "8px",
                  backgroundColor:"#fff",
                  fontWeight:"600"

                }}
              >
                MANAGERIUM
              </p>
            </div>
            <div style={{backgroundColor:"#fff"}}>
              <LoginWithGoogleComp />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginWithGoogle;
