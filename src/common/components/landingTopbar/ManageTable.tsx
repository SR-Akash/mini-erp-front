import React from "react";
import ViewColumn from "../../../assets/images/view-column.svg";

type Props = {};

const ManageTable = (props: Props) => {
  return (
    <div className="d-flex align-items-center">
      <img src={ViewColumn} alt="view-col" />
      <span className="byline-regular" style={{ marginLeft: "8px" }}>
        Manage Table
      </span>
    </div>
  );
};

export default ManageTable;
