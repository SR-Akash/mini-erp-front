import React from "react";
import { downloadFile } from "common/utils/others";
import { useState } from "react";
import ViewModal from ".";
import { baseURL } from "../../../App";
import MButton from "../button/MButton";
import Loading from "../loading";


const AttachmentViewer = ({ attachmentId, onClose }: any) => {

  const [loading, setLoading] = useState(true)
  const attachmentType = () => {
    return attachmentId.substring(
      attachmentId.indexOf(`.`) + 1
    );
  }

  const UnknownType = () => {
    setLoading(false);
    return <b>Unknown file type or might be an excel file.Please download the file</b>;
  }

  return (
    <>
      <ViewModal
        open={attachmentId ? true : false}
        onClose={onClose}
        title="Attachment Viewer"
        isHiddenHeader
        width={700}
        height={400}
      >
        <div className="row">
          {loading && <Loading />}
          <div className="col-lg-12 d-flex justify-content-end mb-2">
            <MButton
              onClick={() => {
                downloadFile(`${baseURL}/sme/Document/DownloadFile?id=${attachmentId}`, attachmentType(), setLoading)
              }}
              type="primary"
              label="Download"
            />
          </div>
          <div style={{marginTop: "5px"}} className="text-center">
            {/* attachmentType === "pdf" ? (
              <PDFViewer
                document={{
                  url: `${baseURL}/sme/Document/DownlloadFile?id=${attachmentId}`,
                }}
              />
            ) */}
            {(attachmentType()?.toLocaleLowerCase() === "jpg" || attachmentType()?.toLocaleLowerCase() === "jpeg" || attachmentType()?.toLocaleLowerCase() === "png") ? (
              <img
                src={`${baseURL}/sme/Document/DownloadFile?id=${attachmentId}`}
                alt=""
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
                style={{ width: "100%" }}
              />
            ) : <UnknownType />}
          </div>
        </div>
      </ViewModal>
    </>
  );
};

export default AttachmentViewer;
