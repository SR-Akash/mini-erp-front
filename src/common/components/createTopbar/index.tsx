import { CloseOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import MButton from "../button/MButton";
import TypoGraphy from "../typography";
import { useNavigate } from "react-router-dom";

type Props = {
  children?: JSX.Element;
  title: string;
  items?: any;
  backHandler?: any;
  isHiddenClose?: any;
  isHiddenSave?: boolean;
};

const CreateTopbar = ({ children, title, items, backHandler, isHiddenClose, isHiddenSave }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const divElements = document.getElementsByClassName("main-content");
    const divElement = divElements[0];
    divElement.classList.add("full-height");
    return () => {
      divElement.classList.remove("full-height");
    };
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-between create-topbar">
      <div className="d-flex align-items-center" style={{ flexGrow: "1" }}>
        {!isHiddenClose && <CloseOutlined
          onClick={() => (backHandler ? backHandler() : navigate(-1))}
          style={{ marginRight: "16px" }}
          className="icon pointer"
        />}

        <span style={{ width: "max-content", marginRight: "32px" }}>
          <TypoGraphy className="paragraph-regular" text={title} />
        </span>
      </div>
      <div style={{ flexGrow: "8" }} className="w-100">
        {children}
      </div>
      <div className="d-flex align-items-center" style={{ flexGrow: "1" }}>
        {!isHiddenClose && <MButton
          onClick={() => (backHandler ? backHandler() : navigate(-1))}
          label="Cancel"
          type="default"
        />}

        {!isHiddenSave && <span style={{ marginLeft: "16px", marginRight: "2px" }}>
          <MButton label="Save" type="primary" htmlType="submit" />
        </span>}
        {items?.length > 0 && (
          <MButton items={items} icon="ellipsis" type="primary" />
        )}
      </div>
    </div>
  );
};

export default CreateTopbar;
