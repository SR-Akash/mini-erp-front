import React from "react";

type Props = {
  label: string;
  icon?: () => JSX.Element;
};

type Classes = {
  Approved: string;
  "Partially Received": string;
  "Partially Delivered": string;
  Rejected: string;
  "Fully Received": string;
  "Fully Delivered": string;
  Pending: string;
  Declined: string;
  "Sales Order": string;
  "Closed": string;
  "Completed" : string;
};

const classes: Classes = {
  Approved: "approved",
  "Partially Received": "partiallyReceived",
  Rejected: "rejected",
  "Fully Received": "fullyReceived",
  Pending: "pending",
  Declined: "declined",
  "Sales Order": "salesOrder",
  "Partially Delivered" : "partiallyDelivered",
  "Fully Delivered" : "fullyDelivered",
  "Closed" : "closed",
  "Completed" : "completed"
};

const Status = ({ label, icon }: Props) => {
  return (
    <span
      style={{ borderRadius: icon ? "4px" : "16px" }}
      className={`${classes[label as keyof Classes]} global-status`}
    >
      {icon && <span>{icon()}</span>}
      {label}
    </span>
  );
};

export default Status;
