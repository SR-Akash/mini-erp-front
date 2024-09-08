import React from "react";
import Car from "../../../assets/images/car.svg";
import Boat from "../../../assets/images/boat.svg";

type Props = {
  localCount: number;
  foreignCount: number;
};

const LocalForeign = ({ localCount, foreignCount }: Props) => {
  return (
    <div className="d-flex align-items-center">
      <img
        style={{ marginRight: "8px" }}
        src={Car}
        alt="car"
      />
      <span className="italic-regular">Local Order</span>
      <span style={{ marginLeft: "8px" }} className="small-regular">
        {localCount}
      </span>
      <img
        style={{ marginLeft: "25px", marginRight: "8px" }}
        src={Boat}
        alt="car"
      />
      <span className="italic-regular">Foreign Order</span>
      <span style={{ marginLeft: "8px" }} className="small-regular">
        {foreignCount}
      </span>
    </div>
  );
};

export default LocalForeign;
