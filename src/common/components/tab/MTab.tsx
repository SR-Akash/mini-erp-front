import { Tabs, TabsProps } from "antd";
import React from "react";
import ConfigProviderWrapper from "../ConfigProviderWrapper";

type Props = {
  items?: TabsProps["items"];
  onChange?: (activeKey: string) => void;
  defaultActiveKey?: string;
  activeKey?: string;
  direction?: "ltr" | "rtl";
  destroyInactiveTabPane?: boolean;
};

const MTab: React.FC<Props> = ({ items, onChange, defaultActiveKey, destroyInactiveTabPane, direction, activeKey }) => {
  return (
    <ConfigProviderWrapper>
      <div className="m-tab-main">
        <Tabs
          defaultActiveKey={defaultActiveKey || "1"}
          items={items}
          onChange={onChange}
          destroyInactiveTabPane={destroyInactiveTabPane}
          direction={direction}
          activeKey={activeKey}
          tabBarStyle={{
            margin: 0,
          }}
        />
      </div>
    </ConfigProviderWrapper>
  );
};

export default MTab;
