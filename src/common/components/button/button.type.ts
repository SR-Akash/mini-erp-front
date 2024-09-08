type MButtonProps = {
  icon?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  type?: "primary" | "default" | "text" | "link";
  label?: React.ReactNode;
  disabled?: boolean;
  size?: "large" | "middle" | "small";
  htmlType?: "button" | "submit" | "reset";
  margin?: number;
  items?: any;
  placement?:
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight"
    | "top"
    | "bottom";
};
export type { MButtonProps };
