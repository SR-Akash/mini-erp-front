import { Col, Drawer, Row, Typography } from "antd";
import React from "react";
import ConfigProviderWrapper from "../ConfigProviderWrapper";
import { CloseOutlined } from "@ant-design/icons";
import TypoGraphy from "../typography";

type Placement = "left" | "right" | "top" | "bottom";
type Props = {
  children: React.ReactNode;
  width?: number | string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: React.ReactNode;
  onCancel?: () => void;
  destroyOnClose?: boolean;
  closable?: boolean;
  placement?: Placement;
};

type GetDrawerHeader = () => JSX.Element;

const MDrawer: React.FC<Props> = ({ children, width, visible, setVisible, title, onCancel, destroyOnClose, closable, placement = "right" }) => {
  const getDrawerHeader: GetDrawerHeader = () => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      {typeof title === "string" ? <TypoGraphy className="paragraph-medium" text={title} /> : title}
      <span onClick={() => (onCancel ? onCancel() : setVisible(false))}>
        <CloseOutlined className="pointer" />
      </span>
    </div>
  );
  return (
    <ConfigProviderWrapper>
      <div className="m-drawer-main">
        <Drawer
          title={getDrawerHeader()}
          width={width}
          closable={closable}
          onClose={() => (onCancel ? onCancel() : setVisible(false))}
          open={visible}
          destroyOnClose={destroyOnClose}
          placement={placement}
          closeIcon={null}
          headerStyle={{ padding: "12px 24px" }}
          bodyStyle={{ padding: "12px 24px" }}
        >
          {children}
        </Drawer>
      </div>
    </ConfigProviderWrapper>
  );
};

export default MDrawer;
