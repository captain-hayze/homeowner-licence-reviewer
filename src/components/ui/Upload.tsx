"use client"
import { useState } from "react";
import { Upload, Spin, Image as AntdImage, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import uploadToS3 from "../../utils/upload";

const { Dragger } = Upload;

type UploadComponentProps = {
  value?: string;
  onChange?: (url: string) => void;
}

export default function UploadComponent({ value, onChange }: UploadComponentProps) {
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>(value || "");

  const handleFileUpload = async (file: UploadFile) => {
    if (!file.originFileObj) return;

    setLoading(true);
    try {
      await uploadToS3({
        file: file.originFileObj as File,
        filename: file.name,
        onSuccess: (url: string) => {
          setUploadedUrl(url);
          onChange?.(url);
          message.success(`${file.name} uploaded successfully`);
        },
        onError: (error) => {
          message.error(`Failed to upload ${file.name}`);
          console.error(error);
        },
      });
    } catch (error) {
      message.error("Upload failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const draggerProps = {
    beforeUpload: () => false, // Prevent auto upload
    onChange(info: { file: UploadFile, fileList: UploadFile[] }) {
      const file = info.fileList[info.fileList.length - 1];
      if (file && file.originFileObj) {
        handleFileUpload(file);
      }
    },
  };

  return (
    <Spin spinning={loading}>
      {uploadedUrl ? (
        <div className="flex flex-col items-center gap-4">
          <AntdImage
            src={uploadedUrl}
            alt="Uploaded document"
            style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
            preview
          />
          <p className="text-sm text-gray-600">{uploadedUrl.split("/").pop()}</p>
        </div>
      ) : (
        <Dragger {...draggerProps} className="w-full">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to upload</p>
        </Dragger>
      )}
    </Spin>
  );
}
