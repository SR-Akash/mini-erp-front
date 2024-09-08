import { CloseOutlined } from "@ant-design/icons";
import { Col, Modal, Row } from "antd";
import React from "react";

type Props = {
  open: boolean;
  width?: number;
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  height?: number | string;
  isHiddenHeader?: boolean;
  renderBtn?: any;
};

const bStyle = {
  fontSize: "16px",
  fontWeight: "500",
};

const ViewModal = ({
  open,
  width,
  children,
  title,
  onClose,
  height,
  isHiddenHeader,
  renderBtn
}: Props) => {
  return (
    <Modal
      onCancel={() => onClose?.()}
      centered
      open={open}
      width={width || 1200}
      destroyOnClose
      bodyStyle={{
        height: height || "80vh",
        overflow: "auto",
      }}
    >
      {!isHiddenHeader && (
        <Row>
          <Col md={24} xs={24}>
            <div
              style={{ marginBottom: "10px" }}
              className="d-flex justify-content-between"
            >
              <b style={bStyle}>{title}</b>
              <div className="d-flex align-items-center">
                {renderBtn?.()}
                <CloseOutlined
                  className="pointer icon"
                  style={{ color: "rgba(0, 0, 0, 0.45)", marginLeft: "10px" }}
                  onClick={onClose}
                />

              </div>
            </div>
          </Col>
        </Row>
      )}
      {children}
    </Modal>
  );
};

export default ViewModal;
