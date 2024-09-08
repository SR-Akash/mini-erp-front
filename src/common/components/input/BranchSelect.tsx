import { Dispatch } from "@reduxjs/toolkit";
import { Select } from "antd";
import { useAppSelector } from "globalRedux/hooks";
import { setDataAction } from "globalRedux/localStorage/actions";
import React from "react";
import { useDispatch } from "react-redux";

type Props = {};

const BranchSelect = (props: Props) => {
  const dispatch: Dispatch<any> = useDispatch();
  const { branchList, selectedBranch } = useAppSelector(
    (state) => state?.localStorage?.auth || {}
  );

  return (
    <Select
      dropdownMatchSelectWidth={false}
      bordered={false}
      defaultValue={selectedBranch}
      className="branch-ddl"
      options={branchList || []}
      onChange={(value, options) => {
        dispatch(setDataAction("auth", "selectedBranch", options));
      }}
    />
  );
};

export default BranchSelect;
