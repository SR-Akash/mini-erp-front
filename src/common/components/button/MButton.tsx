import React, { useState } from "react";
import { Button, Dropdown } from "antd";
import { MButtonProps } from "./button.type";
import {
  CloseOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ConfigProviderWrapper from "../ConfigProviderWrapper";

const MButton = ({
  htmlType = "button",
  type = "default",
  onClick,
  label,
  disabled,
  icon,
  size = "middle",
  items,
  placement,
  margin
}: MButtonProps) => {
  type Icons = {
    [key: string]: React.ReactNode;
  };

  const icons: Icons = {
    ellipsis: <EllipsisOutlined />,
    plus: <PlusOutlined />,
    search: <SearchOutlined />,
    close: <CloseOutlined />,
    download : <DownloadOutlined />,
    upload : <UploadOutlined />
  };

  const [open, setOpen] = useState(false);

  return (
    <ConfigProviderWrapper>
      <div style={{marginTop: margin || 0}} className="m-btn-main">
        {items ? (
          <Dropdown
            // overlayStyle={dropdownObjStyles}
            overlayClassName="m-dropdown-overlay-main"
            menu={{
              items: items?.map((item: any, index: number) => ({
                key: index,
                label: (
                  <span
                    onClick={item?.onClick}
                    className="d-flex align-items-center"
                  >
                    {item?.icon?.()}
                    <span
                      style={{ marginLeft: item?.icon ? "10px" : "0" }}
                      className="base-normal"
                    >
                      {item?.label}
                    </span>
                  </span>
                ),
              })),
            }}
            trigger={["click"]}
            placement={placement}
            open={open}
            onOpenChange={(newValue) => {
              setOpen(newValue);
            }}
          >
            <Button
              htmlType={htmlType}
              type={type}
              className={`m-btn m-btn-${type}`}
              onClick={onClick}
              icon={icons[icon as keyof Icons]}
              size={size}
              disabled={disabled}
            >
              {label}
            </Button>
          </Dropdown>
        ) : (
          <Button
            htmlType={htmlType}
            type={type}
            className={`m-btn m-btn-${type}`}
            onClick={onClick}
            icon={icons[icon as keyof Icons]}
            size={size}
            disabled={disabled}
          >
            {label}
          </Button>
        )}
      </div>
    </ConfigProviderWrapper>
  );
};

export default MButton;
