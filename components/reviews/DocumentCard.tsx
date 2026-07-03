"use client"
import React, { useState } from "react"
import { Card, Modal, message, Input } from "antd";
import useSWRMutation from "swr/mutation";
import { handleMutation } from "@/utils/axios";
import Image from "next/image";

interface DocumentCardProps extends ReviewDocument {
  reviewId: string;
  onSelect: (doc: ReviewDocument) => void;
  onClose?: () => void;
  onApproved?: () => void;
}

export default function DocumentCard(props: DocumentCardProps) {
  const { onSelect, reviewId, onClose, onApproved, ...rest } = props;
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  const { trigger: approveDocument, isMutating } = useSWRMutation(
    "/license-user/approve-document",
    handleMutation,
  );

  
  const handleApprove = async () => {
    try {
      if (!note) {
        message.warning("Please add an approval note before approving the document.");
        return;
      }
      await approveDocument({
        licenseReviewRequestId: reviewId,
        licenseReviewPlanDocumentId: rest.licenseReviewPlanDocumentId,
        approvalNote: note,
      });
      message.success("Document approved successfully");
      onApproved?.();
    } catch (error) {
      console.error("Error approving document:", error);
      message.error("Failed to approve document. Please try again.");
    }
  };

  return (
    <>
      <Card className="mb-3" hoverable onClick={() => {
        setOpen(true);
        onSelect(rest);
      }}>
        <div className="flex items-center justify-between">
          <div className="font-medium">{rest.planDocument.title}</div>
          <div className="text-sm text-gray-500 size-25">
            {rest.documentUrl.includes("pdf")
              ? <div className="bg-[#F2F4F7] size-full flex items-center justify-center rounded">
                  <span className="font-bold text-2xl text-[#667085]">PDF</span>
                </div>
              : <Image
                  src={rest.documentUrl}
                  alt={rest.planDocument.title}
                  loading="eager"
                  width={64}
                  height={64}
                  style={{ height: "auto", width: "auto" }}
                  className="rounded object-cover h-full! w-full!"
                />
            }
          </div>
        </div>
      </Card>
      <Modal
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => {
          setOpen(false);
          setNote("");
          onClose?.()
        }}
        okButtonProps={{
          type: "primary",
          disabled: isMutating,
          loading: isMutating,
          onClick: handleApprove,
        }}
        okText="Approve"
        width="90%"
      >
        <div className="h-[80vh] bg-gray-100 flex items-center justify-center">
          {rest.documentUrl.includes("pdf")
            ? <div className="bg-[#F2F4F7] size-full flex items-center justify-center rounded">
                <span className="font-bold text-2xl text-[#667085]">PDF</span>
              </div>
            : <div className="relative h-full w-full">
                <Image
                  src={rest.documentUrl}
                  alt={rest.planDocument.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded"
                />
              </div>
          }
        </div>
        <div className="mt-4">
          <Input.TextArea
            placeholder="Add an approval note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </Modal>
    </>
  )
}
