import { Input } from "antd";
import React from "react";
import { InputEvent, InputFieldCommon, InputFieldNumber } from "./input.type";

type Props = InputFieldCommon & InputFieldNumber;

type NumericInputType = (props: Props) => JSX.Element;

const NumericInput: NumericInputType = (props) => {
  const { value, onChange, onBlur } = props;

  const handleChange = (e: InputEvent) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;

    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(inputValue);
    }
  }; // '.' at the end or only '-' in the input box.

  const handleBlur = () => {
    let valueTemp = value;

    if (typeof value === "string" && (value?.charAt(value.length - 1) === "." || value === "-")) {
      valueTemp = typeof value === "string" && value?.slice(0, -1);
    }

    onChange(typeof value === "string" ? valueTemp?.replace(/0*(\d+)/, "$1") : null);
    onBlur?.(typeof value === "string" ? valueTemp?.replace(/0*(\d+)/, "$1") : null);
  };

  return (
    <Input {...props} type="text" onChange={handleChange} onBlur={handleBlur} />
  );
};

export default NumericInput;
