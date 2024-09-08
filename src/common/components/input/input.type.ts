import { Dayjs } from "dayjs";

type DisabledTime = (now: Dayjs) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};

type InputFieldCommonProps = {
  className?: string;
  isHiddenLabel?: boolean;
  autoComplete?: string;
  rules?: any;
};

type InputFieldCommon = {
  type: "date" | "number" | "time" | "text" | "file";
  size?: "small" | "middle" | "large";
  status?: "error" | "warning";
  onChange?: (value: any) => void;
  onBlur?: (value: any) => void;
  value?: any;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

type InputFieldDatePicker = {
  disabledPreviousDate?: boolean;
  disabledFutureDate?: boolean;
  date?: any;
  disabledTime?: DisabledTime;
  labelAdditional?: () => JSX.Element;
  picker?: "date" | "week" | "month" | "quarter" | "year";
  onOk?: () => void;
  showTime?: boolean;
};

type InputFieldNumber = {
  step?: number;
  min?: number;
  max?: number;
};

type InputFieldText = {};

type InputFieldProps = InputFieldCommonProps & InputFieldCommon & InputFieldDatePicker & InputFieldNumber & InputFieldText;

type InputEvent = React.ChangeEvent<HTMLInputElement>;
type FocusEvent = React.FocusEvent<HTMLInputElement, Element>;

export type {
  InputFieldProps,
  InputEvent,
  FocusEvent,
  InputFieldCommonProps,
  InputFieldCommon,
  InputFieldDatePicker,
  InputFieldNumber,
  InputFieldText,
};
