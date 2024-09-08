import React from "react";

type Props = {
  children: JSX.Element;
  style?: any;
};

const MainBody = ({ children, style }: Props) => {
  return <div style={style} className="main-body">{children}</div>;
};

export default MainBody;
