import { Dropdown } from "antd";
import React, { useState } from "react";
import { MidballIcon } from "../icon";

type Props = {
  index: number;
  items: any;
  style: any
};

const MidballPopover = ({ index, items, style }: Props) => {
  const [midballIndex, setMidballIndex] = useState(-1);
  const [midballVisible, setMidballVisible] = useState(false);
  return (
    <div
      style={style ? style : {}}
      onClick={(e: any) => {
        setMidballIndex(index)
        e.stopPropagation()
      }}
      className="d-flex justify-content-center align-items-center"
    >
      <Dropdown
        overlayClassName="m-dropdown-overlay-main"
        menu={{
          items: items?.map((item: any, index: number) => ({
            key: index,
            label: (
              <span
                onClick={() => {
                  item?.onClick()
                  setMidballVisible(false);
                }}
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
        placement={"bottomLeft"}
        // open={index === midballIndex ? true : false}
        visible={midballVisible}
        onVisibleChange={(visible: boolean) => {
          setMidballVisible(visible);
        }}
        onOpenChange={(newValue) => {
          if (index === midballIndex) {
            setMidballIndex(-1);
          }
        }}
      >
        <div style={{ height: "16px" }}>
          <MidballIcon
            className="pointer"
          />
        </div>
      </Dropdown>
    </div>
  );
};

export default MidballPopover;
