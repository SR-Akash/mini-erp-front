import { ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import React from "react";
import MSelect from "../input/MSelect";
import MButton from "../button/MButton";
import "./style.css";
import { useNavigate } from "react-router-dom";

const headerStyle = {
  padding: "4px 8px",
  boxShadow:
    "0px 3px 1px -2px rgba(28, 28, 28, 0.2), 0px 2px 2px rgba(28, 28, 28, 0.14), 0px 1px 5px rgba(28, 28, 28, 0.12)",
  marginBottom: "12px",
};

const titleStyle = {
  fontWeight: "500",
  fontSize: "14px",
  lineHeight: "20px",
  color: "#1c1c1c",
  //   paddingLeft: "20px"
};

type Props = {
  title?: string;
  isHiddenDDL?: boolean;
  value?: { value: number; label: string };
  setValue?: React.Dispatch<
    React.SetStateAction<{
      value: number;
      label: string;
    }>
  >;
  buttonClick: (e: any) => void;
  options?: any;
};

const LeftTopbar = ({
  value,
  setValue,
  title,
  buttonClick,
  options,
  isHiddenDDL,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div className="view-left-top" style={headerStyle}>
      <Row align="middle" justify="space-between">
        <Col style={{ padding: 0 }}>
          <div className="d-flex align-items-center">
            <div className="back pointer">
              <span
                onClick={() => {
                  navigate(-1);
                }}
              >
                <ArrowLeftOutlined />
              </span>
            </div>
            {!isHiddenDDL && (
              <div style={{ paddingLeft: "20px" }}>
                <div style={titleStyle}>{title}</div>
                <div style={{ width: "max-content" }}>
                  <MSelect
                    bordered={false}
                    options={options}
                    name="select"
                    label=""
                    placeholder=""
                    value={value}
                    onChange={(value) => {
                      setValue?.(value);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Col>
        <Col style={{ padding: 0 }}>
          <MButton
            onClick={(e: any) => buttonClick(e)}
            size="small"
            label="New"
            icon="plus"
            type="primary"
            htmlType="button"
          />
        </Col>
      </Row>
    </div>
  );
};

export default LeftTopbar;
