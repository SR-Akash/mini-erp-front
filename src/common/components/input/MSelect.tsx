import React from "react";
import { Divider, Form, Select } from "antd";
import MButton from "../button/MButton";
import ConfigProviderWrapper from "../ConfigProviderWrapper";
import TypoGraphy from "../typography";
import useDebounce from "common/hooks/useDebounce";

type AddNewObj = {
  size: "small" | "middle" | "large";
  type: "primary" | "default" | "text" | "link";
  label?: string;
  icon?: string;
  onClick?: () => void;
};

type MSelectProps = {
  options: any[];
  onChange?: (value: any) => void;
  value?: any;
  label?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  isHiddenLabel?: boolean;
  allowClear?: boolean;
  mode?: "multiple" | "tags";
  loading?: boolean;
  rightText?: () => JSX.Element;
  status?: "" | "warning" | "error";
  // size: "small" | "middle" | "large";
  style?: React.CSSProperties;
  addNewObj?: AddNewObj | null;
  bordered?: boolean;
  bottomText?: () => JSX.Element;
  rules?: any;
  onBlur?: any;
  className?: string;
  onSearch?: any;
  open?: boolean;
  onSelect?: any;
};

const onSearch = (value: string) => {
  console.log("search:", value);
};

const MSelect = ({
  label,
  name,
  options,
  placeholder,
  onChange,
  value,
  disabled,
  isHiddenLabel,
  allowClear,
  mode,
  loading,
  rightText,
  status = "",
  style,
  addNewObj,
  bordered,
  bottomText,
  rules,
  onBlur,
  className,
  onSearch,
  open,
  onSelect
}: MSelectProps) => {
  const debounce = useDebounce();
  return (
    <ConfigProviderWrapper>
      <div className="m-select-main">
        {isHiddenLabel ? null : (
          <div className="small-regular">
            <label className="d-flex justify-content-between">
              <span>
                <TypoGraphy text={label || ""} className="small-regular" />
                {rules?.[0]?.required ? (
                  <span className="required">*</span>
                ) : null}
              </span>
              {rightText?.()}
            </label>
          </div>
        )}
        <Form.Item name={name} rules={rules}>
          <Select
            bordered={bordered}
            onSelect={onSelect}
            className={className}
            allowClear={allowClear}
            dropdownMatchSelectWidth={false}
            showSearch
            placeholder={placeholder}
            optionFilterProp="children"
            onChange={(value, option) => {
              onChange?.(option || null);
            }}
            open={open}
            onBlur={onBlur}
            loading={loading}
            mode={mode}
            value={value}
            defaultValue={value}
            onSearch={(value) => {
              debounce(() => {
                onSearch(value);
              }, 500);
            }}
            status={status}
            disabled={disabled}
            filterOption={(input, option) => {
              if (!option) return false;
              return option.label.toLowerCase().includes(input.toLowerCase());
            }}
            options={options}
            size="small"
            style={{ width: "100%", ...style }}
            popupClassName="m-select-dropdown-popup"
            dropdownRender={(menu) =>
              addNewObj ? (
                <div className="small-regular">
                  {menu}
                  <Divider style={{ margin: "6px 0" }} />
                  <MButton
                    onClick={addNewObj.onClick}
                    size={addNewObj.size}
                    type={addNewObj.type}
                    icon={addNewObj.icon ?? "plus"}
                    label={addNewObj?.label ?? "Add New"}
                  />
                </div>
              ) : (
                menu
              )
            }
            dropdownStyle={{
              backgroundColor: "#fff"
            }}
          />
        </Form.Item>
        {bottomText?.()}
      </div>
    </ConfigProviderWrapper>
  );
};

export default MSelect;
