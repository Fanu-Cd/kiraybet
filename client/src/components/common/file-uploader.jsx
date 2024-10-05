import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
const { Dragger } = Upload;
const props = {
  name: "file",
  multiple: true,
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const FileUploader = ({ maxSize, fileList, setFileList }) => {
  const maxFileSize = maxSize; // Set maximum file size in MB (2MB)

  const beforeUpload = (file) => {
    const isFileSizeValid = file.size / 1024 / 1024 < maxFileSize;
    if (!isFileSizeValid) {
      message.error(`File must be smaller than ${maxFileSize}MB!`);
      return;
    }
    setFileList((prevFileList) => [...prevFileList, file]);
    return false;
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Dragger
      beforeUpload={beforeUpload}
      accept=".png,.jpg,.mp4,.mkv,.ts"
      {...props}
      className="w-full"
      maxCount={5}
      onChange={handleChange}
      fileList={fileList}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Files shouldn't be more than {maxFileSize}MB large
      </p>
    </Dragger>
  );
};
export default FileUploader;
