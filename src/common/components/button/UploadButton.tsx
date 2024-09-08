import { Upload, UploadProps } from "antd";
import React from "react";
import MButton from "./MButton";
import { baseURL } from "../../../App";
import { useAppSelector } from "globalRedux/hooks";
import { toast } from "react-toastify";

type Props = {
  files: any;
  setFiles: any;
  label?: any;
  margin?: any;
  accept?: any;
  maxCount?: number;
};

const UploadButton = ({ files, setFiles, label, margin, accept, maxCount }: Props) => {

  const { token } = useAppSelector((state) => state?.localStorage?.auth?.profileData || {});

  const uploadProps: UploadProps = {
    action: `${baseURL}/sme/Document/UploadFileNew`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    maxCount,
    accept: accept || "image/png, image/jpeg, image/jpg, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    onChange({ file, fileList }) {
      if (file.status === "uploading") {
        setFiles(fileList);
      } else if (file.status === "done") {
        setFiles(fileList);
      } else if (file.status === "error") {
        toast.error(file?.response?.message || "Uploading failed");
      }
    },
    fileList: files,
    onRemove(file) {
      let newFile = files.filter((item : any) => item.uid !== file.uid)
      setFiles(newFile)
    },
  };
  return (
    <Upload {...uploadProps}>
      <MButton margin={margin} size="small" label={label || "Attachment"} icon="upload" />
    </Upload>
  );
};

export default UploadButton;
