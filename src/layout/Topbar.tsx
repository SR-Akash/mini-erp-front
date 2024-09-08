import React from "react";
import {
  PlusCircleFilled,
  QuestionCircleOutlined,
  BellOutlined,
  StarOutlined,
  SettingOutlined,
  CarryOutOutlined,
  SearchOutlined,
  KeyOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Input, Popover, Select } from "antd";
import user from "../assets/images/user.png";
import BranchSelect from "common/components/input/BranchSelect";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { setDataAction } from "globalRedux/localStorage/actions";
import { useAppSelector } from "globalRedux/hooks";
import { setCookie } from "common/utils/_cookie";

type Props = {};

const Topbar = (props: Props) => {

  const { profileData } = useAppSelector(state => state?.localStorage?.auth || {})

  const dispatch: Dispatch<any> = useDispatch();

  const profileContent = (
    <div style={{ width: "250px" }}>
      <div
        style={{
          borderBottom: "1px solid #cbcbcb",
          paddingBottom: "10px",
          marginBottom: "10px",
        }}
        className="d-flex align-items-center"
      >
        <Avatar className="user-avatar" size="large" gap={4}>
        {profileData?.userName?.[0]}
        </Avatar>
        <div style={{ marginLeft: "20px" }}>
          <strong>{profileData?.userName}</strong>
          <p>{profileData?.mobileNumber}</p>
        </div>
      </div>
      <div style={{ marginBottom: "10px" }} className="d-flex pointer">
        <div
          style={{
            borderRadius: "0",
            width: "30px",
          }}
          className="d-flex align-items-center justify-content-center"
        >
          <KeyOutlined style={{ fontSize: "16px" }} />
        </div>
        <p>Change Password</p>
      </div>
      <div
        onClick={() => {
          setCookie("mgmU", "" , 0);
          setCookie("mgmP", "" , 0);
          dispatch(setDataAction("auth", "isAuth", false));
        }}
        className="d-flex pointer"
      >
        <div
          style={{
            borderRadius: "0",
            width: "30px",
          }}
          className="d-flex align-items-center justify-content-center"
        >
          <LogoutOutlined style={{ fontSize: "14px" }} />
        </div>
        <p>Logout</p>
      </div>
    </div>
  );

  return (
    <div className="topbar">
      <div className="d-flex align-items-center">
        {/* <PlusCircleFilled className="plus-icon" /> */}
        {/* <div className="line"></div> */}
        {/* <SearchOutlined className="search" /> */}
        {/* <Select
          className="first-ddl"
          bordered={false}
          popupClassName="topbar-first-ddl-list"
          options={[
            {
              value: "Test 1",
              label: "Test 2",
            },
          ]}
        /> */}
        {/* <Input
          className="topbar-search-input"
          placeholder="Search in purchase order ( / )"
        /> */}
      </div>
      <div className="d-flex align-items-center">
        {/* <SettingOutlined className="setting" />
        <CarryOutOutlined className="carry" /> */}
        {/* <div className="line"></div> */}
        {/* <span style={{ marginRight: "44px", marginLeft: "40px" }}> */}
          <BranchSelect />
        {/* </span> */}
        {/* <StarOutlined className="star" />
        <BellOutlined className="bell" />
        <QuestionCircleOutlined className="question" /> */}
        <Popover
          placement="bottomLeft"
          arrow={false}
          content={profileContent}
          trigger="click"
        >
          <Avatar className="user-avatar" size="large" gap={4}>
            {profileData?.userName?.[0]}
          </Avatar>
        </Popover>
      </div>
    </div>
  );
};

export default Topbar;
