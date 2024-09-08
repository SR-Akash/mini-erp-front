import React from "react";
import { Form, Input } from "antd";
import { InputFieldCommon, InputFieldCommonProps } from "./input.type";
import ConfigProviderWrapper from "../ConfigProviderWrapper";
import TypoGraphy from "../typography";

const { TextArea } = Input;

type MTextAreaProps = InputFieldCommonProps & {
  rows?: number;
  labelAdditional?: () => JSX.Element;
  maxLength?: number;
  label?: string;
  placeholder?: string;
  rules?: any;
  name?: string;
};

const MTextArea = ({
  isHiddenLabel,
  label,
  rules,
  labelAdditional,
  maxLength,
  placeholder,
  rows,
  name,
}: MTextAreaProps) => {
  return (
    <ConfigProviderWrapper>
      <div className="m-textarea-main">
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
        <div className="m-textarea">
          <Form.Item name={name} rules={rules}>
            <TextArea
              rows={rows}
              placeholder={placeholder}
              maxLength={maxLength}
            />
          </Form.Item>
        </div>
      </div>
    </ConfigProviderWrapper>
  );
};

export default MTextArea;
