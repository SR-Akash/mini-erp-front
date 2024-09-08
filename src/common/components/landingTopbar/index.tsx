import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import React, { useState } from "react";
import MButton from "../button/MButton";

type DropDownObj = {
  dropdownObjStyles?: React.CSSProperties;
  placement?:
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight"
    | "top"
    | "bottom";
};

type Props = {
  createLabel: string;
  createClick: any;
  title: string;
  starMarkClick: any;
  isYellowStarMark?: boolean;
  isDisabledCreate?: boolean;
  children?: any;
  dropdownObj?: DropDownObj;
  items?: any;
};

const LandingTopbar = (props: Props) => {
  const {
    createLabel,
    createClick,
    title,
    starMarkClick,
    isYellowStarMark,
    isDisabledCreate,
    children,
    dropdownObj,
    items
  } = props;
  const { dropdownObjStyles, placement } = dropdownObj || {};
  const [open, setOpen] = useState(false);
  return (
    <div className="landing-topbar">
      <div className="d-flex align-items-center">
        <p
          style={{ paddingRight: "12px", width: "max-content" }}
          className="heading-4"
        >
          {title}
        </p>
        {isYellowStarMark ? (
          <StarFilled
            onClick={starMarkClick}
            style={{ color: "#E9B550" }}
            className="icon"
          />
        ) : (
          <StarOutlined onClick={starMarkClick} className="icon" />
        )}
      </div>
      <div className="children">{children}</div>
      {items ? (
        <div>
          <Dropdown
            overlayStyle={dropdownObjStyles}
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
                )
              }))
            }}
            trigger={["click"]}
            placement={placement}
            open={open}
            onOpenChange={(newValue) => {
              setOpen(newValue);
            }}
          >
            <MButton
              onClick={() => {
                setOpen(!open);
              }}
              icon="plus"
              label={createLabel}
              type="primary"
              disabled={isDisabledCreate}
            />
          </Dropdown>
        </div>
      ) : (
        <div>
          <MButton
            onClick={createClick}
            icon="plus"
            label={createLabel}
            type="primary"
            disabled={isDisabledCreate}
          />
        </div>
      )}
    </div>
  );
};

export default LandingTopbar;
