import React from "react";

type Props = {
  children: React.ReactElement;
};

const ScrollableTable = ({ children }: Props) => {
  return <div className="scrollable-table"><table>{children}</table></div>;
};

export default ScrollableTable;
