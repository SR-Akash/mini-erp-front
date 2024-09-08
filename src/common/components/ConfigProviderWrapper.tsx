import { ConfigProvider } from "antd";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const ConfigProviderWrapper = ({ children }: Props) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0A8080",
          borderRadius: 0,
          borderRadiusSM: 0,
          borderRadiusLG: 0,
          borderRadiusOuter: 0,
        },
        components: {
          Input: {},
          Button: {},
          Select: {},
          Switch: {},
          Tabs: {
            colorPrimary: "#F45D48",
            colorPrimaryHover:"#1C1C1C"
          },
          Steps : {
            colorPrimary: "#F45D48",
            controlItemBgActive : "rgba(244,93,72, .3)",
          },
          Radio : {
            colorPrimary: "#F45D48",
          }
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ConfigProviderWrapper;
