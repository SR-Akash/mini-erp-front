import { DatePicker, Form, Input, TimePicker } from "antd";
import React from "react";
import { FocusEvent, InputEvent, InputFieldProps } from "./input.type";
import dayjs from "dayjs";
import NumericInput from "./Numeric";
import ConfigProviderWrapper from "../ConfigProviderWrapper";
import TypoGraphy from "../typography";
const dateFormat = "YYYY-MM-DD";

type InputFieldType = (props: InputFieldProps) => JSX.Element;

const MInputField: InputFieldType = ({
  name,
  label,
  type,
  onChange,
  min,
  max,
  step,
  disabled,
  value,
  placeholder,
  isHiddenLabel,
  showTime,
  onOk,
  disabledPreviousDate,
  disabledFutureDate,
  date,
  onBlur,
  disabledTime,
  labelAdditional,
  allowClear,
  picker,
  className,
  size = "small",
  status,
  style,
  autoComplete,
  rules,
}) => {
  return (
    <ConfigProviderWrapper>
      <div className="m-input-field-main">
        {isHiddenLabel ? null : (
          <label className="small-regular">
            <div className="d-flex justify-content-between">
              <span>
                <TypoGraphy text={label || ""} className="small-regular" />
                {rules?.[0]?.required ? (
                  <span className="required">*</span>
                ) : null}
              </span>
              {labelAdditional?.()}
            </div>
          </label>
        )}
        <div className="m-input-field">
          {type === "date" ? (
            <Form.Item name={name} rules={rules}>
              <DatePicker
                style={{ borderRadius: 0, ...style }}
                size="small"
                name={name}
                value={value ? dayjs(value, dateFormat) : null}
                picker={picker}
                disabled={disabled}
                allowClear={allowClear}
                onChange={(date, dateString) => {
                  onChange?.(dateString);
                }}
                onBlur={onBlur}
                status={status}
                placeholder={placeholder}
                showTime={showTime}
                onOk={onOk}
                className={className}
              />
            </Form.Item>
          ) : type === "time" ? (
            <Form.Item name={name} rules={rules}>
              <TimePicker
                style={{ display: "block", fontSize: "12px" }}
                size="small"
                name={name}
                use12Hours
                value={value}
                format="h:mm a"
                status={status}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                // disabledTime={disabledTime}
              />
            </Form.Item>
          ) : type === "number" ? (
            <Form.Item name={name} rules={rules}>
              <NumericInput
                type="number"
                name={name}
                style={{ borderRadius: 0, ...style }}
                size="small"
                value={value}
                status={status}
                step={step}
                disabled={disabled}
                onBlur={onBlur}
                onChange={(value) => {
                  if (value === null) return;
                  onChange?.(value);
                }}
                placeholder={placeholder}
                className={className}
                allowClear={allowClear}
              />
            </Form.Item>
          ) : (
            <Form.Item name={name} rules={rules}>
              <Input
                status={status}
                onChange={(e: InputEvent) => {
                  let isFile = type === "file";
                  onChange?.(isFile ? e.target.files : e.target.value)
                }}
                allowClear={allowClear}
                name={name}
                disabled={disabled}
                value={value}
                size="small"
                type={type}
                onBlur={(e: FocusEvent) => onBlur?.(e.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                style={{ borderRadius: 0, ...style }}
                className={className}
              />
            </Form.Item>
          )}
        </div>
      </div>
    </ConfigProviderWrapper>
  );
};

export default MInputField;
