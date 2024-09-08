import {
  EditOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { commonPdfExport } from "common/utils/pdf";
import React, { useEffect } from "react";
import ReactToPrint from "react-to-print";

const titleStyle = {
  color: "#2990E2",
  fontWeight: "500",
  fontSize: "18px",
};

const mainStyle = {
  padding: "12px 24px",
  background: "#FBFAFA",
  borderBottom: "1px solid #DCDCDC",
  // marginBottom: "10px",
};

const textStyle = {
  padding: "0 12px",
  borderRight: "1px solid #EAEAEA",
  fontWeight: "400",
  fontSize: "14px",
  color: "#1C1C1C",
};
const iconStyle = {
  paddingLeft: "12px",
};

type Props = {
  title: string;
  editClick?: (e: any) => void;
  renderBtn?: any;
  printRef?: any;
  orientation?: string;
  setPdfLoading?: any;
  isHiddenPrint?: boolean;
  isHiddenPdf?: boolean;
};

const RightTopbar = ({
  title,
  editClick,
  printRef,
  orientation,
  setPdfLoading,
  renderBtn,
  isHiddenPrint,
  isHiddenPdf
}: Props) => {
  useEffect(() => {
    const divElements = document.getElementsByClassName("main-content");
    const divElement = divElements[0];
    divElement.classList.add("full-height");
    return () => {
      divElement.classList.remove("full-height");
    };
  }, []);

  return (
    <div style={mainStyle} className="d-flex justify-content-between w-100">
      <div style={titleStyle}>{title}</div>
      <div className="d-flex align-items-center">
        <div className="pointer" onClick={(e: any) => editClick?.(e)}>
          {editClick && <>
            <span style={iconStyle}>
              <EditOutlined className="icon" />
            </span>
            <span style={textStyle}>Edit</span>
          </>}
        </div>
        {!isHiddenPrint && <ReactToPrint
          pageStyle="@page { size: 8in 12in  !important; margin: 5mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
          trigger={() => (
            <div className="pointer">
              <span style={iconStyle}>
                <PrinterOutlined className="icon" />
              </span>
              <span style={textStyle}>Print</span>
            </div>
          )}
          // onAfterPrint={(e: Event) => {}}
          content={() => printRef?.current}
        />}


        {!isHiddenPdf && <div
          className="pointer"
          onClick={(e: any) =>
            commonPdfExport({ setPdfLoading, title, orientation })
          }
        >
          <span style={iconStyle}>
            <FilePdfOutlined className="icon" />
          </span>
          <span
            style={{ ...textStyle, paddingRight: "0", borderRight: "none" }}
          >
            PDF Download
          </span>
        </div>}
        {renderBtn?.()}
      </div>
    </div>
  );
};

export default RightTopbar;
