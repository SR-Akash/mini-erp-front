import { Spin } from "antd";
import React from "react";
import styles from "./loading.module.css"

const Loading = () => {
  return (
    <div className={styles?.globalloading}>
      <Spin />
    </div>
  );
};

export default Loading;
