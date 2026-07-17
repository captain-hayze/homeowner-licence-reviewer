import { useState } from "react"
import { Card, Modal, message, Input, Button } from "antd";
import useSWRMutation from "swr/mutation";
import { Image } from "antd";
import PDFViewer from "./PDFViewer";
import { handleMutation } from "../../utils/axios";
import type { AxiosError } from "axios";

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
      const axiosError = error as AxiosError<{ error?: string }>;
      console.error("Error approving document:", error);
      message.error(axiosError.response?.data?.error || "Failed to approve document. Please try again.");
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
                  preview={false}
                />
            }
          </div>
        </div>
      </Card>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setNote("");
          onClose?.()
        }}
        width="90%"
        footer={[
          <Button key="cancel" onClick={() => {
            setOpen(false);
            setNote("");
            onClose?.();
          }}>Cancel</Button>,
          <Button key="print" onClick={() => {
            if (typeof window !== 'undefined') {
              const isPdf = rest.documentUrl.toLowerCase().includes("pdf");
              const searchParams = new URLSearchParams({
                url: rest.documentUrl,
                title: rest.planDocument.title,
                type: isPdf ? "pdf" : "image",
              });
              window.open(`/print?${searchParams.toString()}`, '_blank', 'noopener,noreferrer,width=900,height=700');
            }
          }}>Print</Button>,
          <Button
            key="approve"
            type="primary"
            disabled={isMutating || !note}
            loading={isMutating}
            onClick={handleApprove}
          >Approve</Button>
        ]}
      >
        <div className="h-[80vh] bg-gray-100 flex items-center justify-center overflow-auto">
          {rest.documentUrl.includes("pdf")
            ? <div className="h-full w-full">
                <PDFViewer url={rest.documentUrl} />
              </div>
            : <div className="h-full">
                <img
                  src={rest.documentUrl}
                  alt={rest.planDocument.title}
                  style={{ objectFit: 'contain' }}
                  className="rounded size-full"
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
