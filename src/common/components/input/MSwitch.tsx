import { Form, Switch } from "antd";
import React from "react";
import ConfigProviderWrapper from "../ConfigProviderWrapper";

type MSwitchProps = {
  onChange?: (
    checked: boolean,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  defaultChecked?: boolean;
  prefixCls?: string;
  size?: "small" | "default";
  className?: string;
  rootClassName?: string;
  checked?: boolean;
  onClick?: (
    checked: boolean,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  style?: React.CSSProperties;
  title?: string;
  tabIndex?: number;
  id?: string;
  rules?: any;
  name?: string;
};

const MSwitch = ({
  onChange,
  defaultChecked,
  size = "default",
  title,
  disabled,
  onClick,
  loading,
  name,
  rules,
}: MSwitchProps) => {
  return (
    <ConfigProviderWrapper>
      <div className="m-switch-main">
        <Form.Item name={name} rules={rules}>
          <Switch
            defaultChecked={defaultChecked}
            onChange={onChange}
            size={size}
            title={title}
            disabled={disabled}
            onClick={onClick}
            loading={loading}
          />
        </Form.Item>
      </div>
    </ConfigProviderWrapper>
  );
};

export default MSwitch;
