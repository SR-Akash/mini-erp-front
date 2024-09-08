import React from "react";
import car from "../../../assets/images/car.svg";
import boat from "../../../assets/images/boat.svg";
import midball from "../../../assets/images/midball.svg";
import { EyeOutlined } from "@ant-design/icons";

export const CarIcon = ({ className }: { className?: string }) => (
  <img className={className} src={car} alt="car" />
);
export const BoatIcon = ({ className }: { className?: string }) => (
  <img className={className} src={boat} alt="boat" />
);
export const MidballIcon = ({
  className,
  onClick
}: {
  className?: string;
  onClick?: () => void;
}) => (
  <img onClick={onClick} className={className} src={midball} alt="midball" />
);
export const ViewIcon = ({
  className,
  title,
  type,
  style,
  onAction
}: {
  className?: string;
  title?: string;
  type: string;
  style?:any,
  onAction: () => void;
}) => {
  return (
    <EyeOutlined
      title={title}
      className={className}
      type={type}
      onClick={onAction}
    />
  );
};
