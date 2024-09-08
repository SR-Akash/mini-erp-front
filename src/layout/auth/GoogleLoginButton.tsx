import React from 'react';
import { Button } from "antd";

interface PropsType {
  type?: "default" | "primary" | "ghost" | "dashed" | "link" | "text";
  title: string;
  onClick?: any;
  size?: "large" | "middle" | "small";
  disabled?: boolean;
  isSubmitType?: boolean;
  isIcon?: boolean;
  iconSrc?: string;  // URL of the image
  isFullwidth?: boolean;
  btnStyleType?: string;
  buttonClass?: string;
}

export default function HButton({
  type = "default",
  title,
  onClick,
  size = "middle",
  disabled,
  isSubmitType = false,
  isIcon = false,
  iconSrc,
  isFullwidth = false,
  btnStyleType,
  buttonClass,
}: PropsType) {
  return (
    <Button
      className={buttonClass}
      type={type}
      htmlType={isSubmitType ? "submit" : "button"}
      onClick={(e) => onClick && onClick(e)}
      size={size}
      disabled={disabled}
      icon={isIcon && iconSrc ? <img src={iconSrc} alt="icon" style={{ width: '20px', marginRight: '8px' }} /> : null}
      style={{
        fontWeight: 500,
        width: isFullwidth ? "100%" : "auto",
        textTransform: "capitalize",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize:"16px",
        padding: "19px 0px",
      }}
    >
      {title}
    </Button>
  );
}
