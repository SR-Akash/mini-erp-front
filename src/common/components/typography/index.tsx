import React from "react";

type Props = {
  className: string;
  text: string;
  style?: any;
};

const TypoGraphy = (props: Props) => {
  return <span style={props.style} className={props.className}>{props.text}</span>;
};

export default TypoGraphy;
